using BookStore.Models;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Data;

public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Genre> Genres { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed Authors
        modelBuilder.Entity<Author>().HasData(
            new Author { AuthorId = 1, Name = "J.K. Rowling", Biography = "British author, best known for the Harry Potter series." },
            new Author { AuthorId = 2, Name = "J.R.R. Tolkien", Biography = "English writer and professor, known for The Hobbit and The Lord of the Rings." }
        );

        // Seed Genres
        modelBuilder.Entity<Genre>().HasData(
            new Genre { GenreId = 1, GenreName = "Fantasy" },
            new Genre { GenreId = 2, GenreName = "Science Fiction" }
        );

        // Seed Books
        modelBuilder.Entity<Book>().HasData(
            new Book { BookId = 1, Title = "Harry Potter and the Sorcerer's Stone", AuthorId = 1, GenreId = 1, Price = 19.99m, PublicationDate = new DateTime(1997, 6, 26) },
            new Book { BookId = 2, Title = "The Hobbit", AuthorId = 2, GenreId = 1, Price = 14.99m, PublicationDate = new DateTime(1937, 9, 21) },
            new Book { BookId = 3, Title = "Dune", AuthorId = 2, GenreId = 2, Price = 25.00m, PublicationDate = new DateTime(1965, 8, 1) }
        );
    }
}
