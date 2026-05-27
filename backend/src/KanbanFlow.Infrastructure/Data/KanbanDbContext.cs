using Microsoft.EntityFrameworkCore;

using KanbanFlow.Domain.Entities;

namespace KanbanFlow.Infrastructure.Data;

public class KanbanDbContext
    : DbContext
{
    public KanbanDbContext(
        DbContextOptions<KanbanDbContext>
            options
    ) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Team> Teams => Set<Team>();

    public DbSet<Project> Projects
        => Set<Project>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(
            modelBuilder
        );

        modelBuilder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Team>()
            .HasOne(x => x.Owner)
            .WithMany()
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Project>()
            .HasOne(x => x.Team)
            .WithMany(x => x.Projects)
            .HasForeignKey(x => x.TeamId);
    }
}