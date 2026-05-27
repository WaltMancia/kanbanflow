using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

using KanbanFlow.Domain.Entities;
using KanbanFlow.Domain.Enums;
using TaskStatus = KanbanFlow.Domain.Enums.TaskStatus;

namespace KanbanFlow.Infrastructure.Data.Seed;

public static class DatabaseSeeder
{
    private const string AdminEmail =
        "admin@kanbanflow.com";

    private const string AdminPassword =
        "Admin123!";

    public static async Task SeedAsync(
        KanbanDbContext context
    )
    {
        var admin = await context.Users
            .FirstOrDefaultAsync(
                x => x.Email == AdminEmail
            );

        if (admin is null)
        {
            admin = new User
            {
                Name = "Admin User",

                Email = AdminEmail,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        AdminPassword
                    ),

                Role = UserRole.Admin
            };

            context.Users.Add(admin);
        }
        else
        {
            admin.Name = "Admin User";

            admin.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    AdminPassword
                );

            admin.Role = UserRole.Admin;
        }

        await context.SaveChangesAsync();

        if (await context.Teams.AnyAsync())
        {
            return;
        }

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