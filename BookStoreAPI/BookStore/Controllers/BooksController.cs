using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.Extensions;

namespace BookStore.Controllers;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/books
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.Include(b => b.Author).Include(b => b.Genre).ToListAsync();
    }

    // GET: api/books/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.Include(b => b.Author).Include(b => b.Genre).FirstOrDefaultAsync(b => b.BookId == id);

        if (book == null)
        {
            // Return 404 if the book is not found
            return NotFound();
        }

        return book;
    }

    // POST: api/books
    [HttpPost]
    public async Task<ActionResult<object>> AddBook([FromForm] CreateBookDto createBookDto)
    {
        // Validate the model state
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
            string? path = null;
            if (createBookDto.BookImage != null)
            {
                path = Path.Combine(uploadPath, createBookDto.BookImage.FileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await createBookDto.BookImage.CopyToAsync(stream);
                }
                path = "https://localhost:7146/uploads/" + createBookDto.BookImage.FileName;
            }
            var book = createBookDto.ToBook(path);
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            // Return a 201 Created response with the URI of the newly created book
            return new { message = "Book created successfully" };
        }
        catch (Exception ex)
        {
            // Return a 400 Bad Request response with the exception message
            return BadRequest(new { error = ex.Message });
        }
    }


    // PUT: api/books/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromForm] CreateBookDto updateBookDto)
    {
        // Validate the model state
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingBook = await _context.Books.FindAsync(id);
        if (existingBook == null)
        {
            return NotFound(new { error = "Book not found" });
        }
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }
        string? path = null;
        if (updateBookDto.BookImage != null)
        {
            path = Path.Combine(uploadPath, updateBookDto.BookImage.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await updateBookDto.BookImage.CopyToAsync(stream);
            }
            path = "https://localhost:7146/uploads/" + updateBookDto.BookImage.FileName;
        }
        existingBook.Title = updateBookDto.Title;
        existingBook.GenreId = updateBookDto.GenreId;
        existingBook.Price = updateBookDto.Price;
        existingBook.PublicationDate = updateBookDto.PublicationDate;
        existingBook.ImagePath ??= path;
        existingBook.AuthorId = updateBookDto.AuthorId;
        if(updateBookDto.RemoveImage != null)
        {
            if ((bool)updateBookDto.RemoveImage)
            {
                existingBook.ImagePath = null;
            }
        }

        _context.Books.Update(existingBook);
        await _context.SaveChangesAsync();

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book updated successfully", existingBook });
        }
        catch (DbUpdateConcurrencyException)
        {
            // Check if the book exists
            if (!_context.Books.Any(b => b.BookId == id))
            {
                return NotFound(new { error = "Book not found" });
            }
            else
            {
                // Re-throw the exception if it's not related to the book's existence
                throw;
            }
        }
        catch (Exception ex)
        {
            // Return a 400 Bad Request for other exceptions
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE: api/books/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        try
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                // Return 404 if the book is not found
                return NotFound(new { error = "Book not found" });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            // Return 204 for a successful deletion with no content
            return NoContent();
        }
        catch (System.Exception ex)
        {
            // Return 500 for an internal server error with the exception message
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // GET: api/Books/search?query=searchTerm
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Book>>> SearchBooks([FromQuery] string query)
    {
        try
        {
            var books = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Genre)
                .Where(b => b.Title.Contains(query) ||
                            b.Author.Name.Contains(query) ||
                            b.Genre.GenreName.Contains(query))
                .ToListAsync();

            return Ok(books);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { message = "Error searching books by title", error = ex.Message });
        }
    }
}