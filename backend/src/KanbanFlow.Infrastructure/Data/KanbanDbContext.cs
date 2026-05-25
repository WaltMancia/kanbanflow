using Microsoft.EntityFrameworkCore;
using KanbanFlow.Domain.Entities;

namespace KanbanFlow.Infrastructure.Data;

public class KanbanDbContext : DbContext
{
    public KanbanDbContext(
        DbContextOptions<KanbanDbContext> options
    ) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();
    }
}