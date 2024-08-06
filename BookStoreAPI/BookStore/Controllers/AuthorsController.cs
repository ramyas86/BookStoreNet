using BookStore.Data;
using BookStore.Extensions;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers;
[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class AuthorsController : ControllerBase
{
    private readonly BookstoreContext _context;

    public AuthorsController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuthors([FromQuery] string? letter, [FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.Authors.AsQueryable();

            if (!string.IsNullOrEmpty(letter))
            {
                query = query.Where(a => a.Name.StartsWith(letter));
            }

            var totalItems = await query.CountAsync();
            var authors = await query.Skip((page - 1) * limit).Take(limit).ToListAsync();

            return Ok(new
            {
                authors,
                totalPages = (int)Math.Ceiling(totalItems / (double)limit)
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAuthorById(int id)
    {
        try
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            return Ok(author);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddAuthor([FromForm] CreateAuthorDto createAuthor)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            string? path = null;
            if (createAuthor.AuthorImage != null)
            {
                path = Path.Combine(uploadPath, createAuthor.AuthorImage.FileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await createAuthor.AuthorImage.CopyToAsync(stream);
                }
                path = "https://localhost:7146/uploads/" + createAuthor.AuthorImage.FileName;
            }
            var author = createAuthor.ToAuthor(path);

            await _context.Authors.AddAsync(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuthorById), new { id = createAuthor.AuthorId }, new { message = "Author added successfully", createAuthor });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAuthor(int id, [FromForm] CreateAuthorDto updateAuthor)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingAuthor = await _context.Authors.FindAsync(id);

            if (existingAuthor == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            string? path = null;
            if (updateAuthor.AuthorImage != null)
            {
                path = Path.Combine(uploadPath, updateAuthor.AuthorImage.FileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await updateAuthor.AuthorImage.CopyToAsync(stream);
                }
                path = "https://localhost:7146/uploads/" + updateAuthor.AuthorImage.FileName;
                existingAuthor.ImagePath = path;
            }

            if (updateAuthor.RemoveImage != null)
            {
                if ((bool)updateAuthor.RemoveImage)
                {
                    existingAuthor.ImagePath = null;
                }
            }

            existingAuthor.Name = updateAuthor.Name;
            existingAuthor.Biography = updateAuthor.Biography;
            // Update other properties as needed

            _context.Authors.Update(existingAuthor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Author updated successfully", author = existingAuthor });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        try
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound(new { error = "Author not found" });
            }

            var books = await _context.Books.Where(b => b.AuthorId == id).ToListAsync();

            if (books.Count > 0)
            {
                return BadRequest(new { error = "Cannot delete author because there are books associated with this author." });
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Author deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while trying to delete the author." });
        }
    }
}
