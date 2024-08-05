using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore.Models;

public class Genre
{
    public int GenreId { get; set; }

    [Required]
    [StringLength(50, ErrorMessage = "The genre name must be between 1 and 50 characters.")]
    public string GenreName { get; set; }

    [JsonIgnore]
    public ICollection<Book>? Books { get; set; }
}