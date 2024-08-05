using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore.Models;

public class CreateAuthorDto
{
    public int AuthorId { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "The name must be between 1 and 100 characters.")]
    public required string Name { get; set; }

    [StringLength(2000, ErrorMessage = "The biography must be between 0 and 2000 characters.")]
    public string? Biography { get; set; }

    public IFormFile? AuthorImage { get; set; }

    [JsonIgnore]
    public ICollection<Book>? Books { get; set; }
}