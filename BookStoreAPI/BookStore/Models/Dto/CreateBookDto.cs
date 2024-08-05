using System.ComponentModel.DataAnnotations;

namespace BookStore.Models;

public class CreateBookDto
{
    public int BookId { get; set; }

    [Required]
    [StringLength(200, ErrorMessage = "The title must be between 1 and 200 characters.")]
    public string? Title { get; set; }

    [Required]
    public int AuthorId { get; set; }

    [Required]
    public int GenreId { get; set; }

    [Required]
    [Range(0.01, 1000, ErrorMessage = "The price must be between 0.01 and 1000.")]
    public decimal Price { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime PublicationDate { get; set; }

    public IFormFile? BookImage { get; set; }

    public Author? Author { get; set; }

    public Genre? Genre { get; set; }
}