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

    public DbSet<TaskItem> Tasks
        => Set<TaskItem>();

    public DbSet<TaskComment> TaskComments
        => Set<TaskComment>();

    public DbSet<TaskAttachment> TaskAttachments
        => Set<TaskAttachment>();

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

        modelBuilder.Entity<TaskItem>()
            .HasOne(x => x.Project)
            .WithMany()
            .HasForeignKey(x => x.ProjectId);

        modelBuilder.Entity<TaskItem>()
            .HasOne(x => x.Assignee)
            .WithMany()
            .HasForeignKey(x => x.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TaskComment>()
            .HasOne(x => x.TaskItem)
            .WithMany()
            .HasForeignKey(x => x.TaskItemId);

        modelBuilder.Entity<TaskComment>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId);

        modelBuilder.Entity<TaskAttachment>()
            .HasOne(x => x.TaskItem)
            .WithMany()
            .HasForeignKey(x => x.TaskItemId);

        modelBuilder.Entity<TaskAttachment>()
            .HasOne(x => x.UploadedBy)
            .WithMany()
            .HasForeignKey(x => x.UploadedById);
    }
}