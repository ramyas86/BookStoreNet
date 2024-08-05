using BookStore.Models;

namespace BookStore.Extensions;

public static class BookExtensions
{
    public static Book ToBook(this CreateBookDto createBookDto, string? imagePath)
    {
        return new Book
        {
            Author = createBookDto.Author,
            AuthorId = createBookDto.AuthorId,
            BookId = createBookDto.BookId,
            Genre = createBookDto.Genre,
            GenreId = createBookDto.GenreId,
            ImagePath = imagePath,
            Price = createBookDto.Price,
            PublicationDate = createBookDto.PublicationDate,
            Title = createBookDto.Title
        };
    }
}
