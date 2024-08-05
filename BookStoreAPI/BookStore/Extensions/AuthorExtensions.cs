using BookStore.Models;

namespace BookStore.Extensions;

public static class AuthorExtensions
{
    public static Author ToAuthor(this CreateAuthorDto createAuthorDto, string? imagePath)
    {
        return new Author
        {
            Name = createAuthorDto.Name,
            AuthorId = createAuthorDto.AuthorId,
            Biography = createAuthorDto.Biography,
            Books = createAuthorDto.Books,
            ImagePath = imagePath
        };
    }
}
