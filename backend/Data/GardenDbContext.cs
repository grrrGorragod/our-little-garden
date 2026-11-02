
using Microsoft.EntityFrameworkCore;
using OurLittleGarden.Api.Models;

namespace OurLittleGarden.Api.Data;

public class GardenDbContext : DbContext
{
    public GardenDbContext(DbContextOptions<GardenDbContext> options)
        : base(options)
    {
    }

    public DbSet<Flower> Flowers => Set<Flower>();

    public DbSet<GardenMessage> GardenMessages => Set<GardenMessage>();

    public DbSet<DailyFlowerClaim> DailyFlowerClaims
        => Set<DailyFlowerClaim>();

    public DbSet<LetterMessage> LetterMessages
        => Set<LetterMessage>();

    public DbSet<DailyLetter> DailyLetters
        => Set<DailyLetter>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DailyLetter>()
            .HasOne(letter => letter.LetterMessage)
            .WithMany()
            .HasForeignKey(letter => letter.LetterMessageId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LetterMessage>()
            .Property(message => message.Content)
            .HasMaxLength(2000)
            .IsRequired();

        modelBuilder.Entity<DailyLetter>()
            .Property(letter => letter.FlowerType)
            .HasMaxLength(20)
            .IsRequired();
    }
}
