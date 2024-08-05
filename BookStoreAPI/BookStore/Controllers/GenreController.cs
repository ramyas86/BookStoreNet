namespace BookStore.Controllers;

using BookStore.Data;
using BookStore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class GenresController : ControllerBase
{
    private readonly BookstoreContext _context;

    public GenresController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/genres
    [HttpGet]
    public async Task<IActionResult> GetGenres()
    {
        try
        {
            var genres = await _context.Genres.ToListAsync();
            return Ok(genres);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // GET: api/genres/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGenreById(int id)
    {
        try
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre == null)
            {
                return NotFound(new { error = "Genre not found" });
            }
            return Ok(genre);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // POST: api/genres
    [HttpPost]
    public async Task<IActionResult> AddGenre([FromBody] Genre genre)
    {
        if (string.IsNullOrWhiteSpace(genre.GenreName))
        {
            return BadRequest(new { error = "Genre name cannot be empty" });
        }

        try
        {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGenreById), new { id = genre.GenreId }, new { message = "Genre created successfully", genre });
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("UNIQUE") ?? false)
        {
            return BadRequest(new { error = "Genre name must be unique" });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}