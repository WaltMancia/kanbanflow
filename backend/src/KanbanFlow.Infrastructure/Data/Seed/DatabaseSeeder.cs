using BCrypt.Net;

using KanbanFlow.Domain.Entities;
using KanbanFlow.Domain.Enums;
using TaskStatus = KanbanFlow.Domain.Enums.TaskStatus;

namespace KanbanFlow.Infrastructure.Data.Seed;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(
        KanbanDbContext context
    )
    {
        if (context.Users.Any())
        {
            return;
        }

        var admin = new User
        {
            Name = "Admin User",

            Email = "admin@kanbanflow.com",

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    "Admin123!"
                ),

            Role = UserRole.Admin
        };

        context.Users.Add(admin);

        await context.SaveChangesAsync();

        var team = new Team
        {
            Name = "Development Team",

            Description =
                "Main software team",

            OwnerId = admin.Id
        };

        context.Teams.Add(team);

        await context.SaveChangesAsync();

        var project = new Project
        {
            Name = "KanbanFlow SaaS",

            Description =
                "Main portfolio project",

            TeamId = team.Id
        };

        context.Projects.Add(project);

        await context.SaveChangesAsync();

        var tasks = new List<TaskItem>
        {
            new()
            {
                Title = "Create Login UI",

                Description =
                    "Modern auth screen",

                ProjectId = project.Id,

                Priority = TaskPriority.High,

                Status = TaskStatus.Todo
            },

            new()
            {
                Title = "Build Dashboard",

                Description =
                    "Statistics and charts",

                ProjectId = project.Id,

                Priority = TaskPriority.Medium,

                Status = TaskStatus.InProgress
            },

            new()
            {
                Title = "Deploy API",

                Description =
                    "Production deployment",

                ProjectId = project.Id,

                Priority = TaskPriority.Urgent,

                Status = TaskStatus.Review
            }
        };

        context.Tasks.AddRange(tasks);

        await context.SaveChangesAsync();
    }
}