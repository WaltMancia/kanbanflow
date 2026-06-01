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
        var admin = await EnsureUserAsync(
            context,
            "Admin User",
            AdminEmail,
            AdminPassword,
            UserRole.Admin
        );

        var productLead = await EnsureUserAsync(
            context,
            "Laura Product",
            "laura.product@kanbanflow.com",
            "Product123!",
            UserRole.Manager
        );

        var designer = await EnsureUserAsync(
            context,
            "Nina Design",
            "nina.design@kanbanflow.com",
            "Design123!",
            UserRole.Member
        );

        var developer = await EnsureUserAsync(
            context,
            "Diego Dev",
            "diego.dev@kanbanflow.com",
            "Dev123!",
            UserRole.Member
        );

        var qaEngineer = await EnsureUserAsync(
            context,
            "Paula QA",
            "paula.qa@kanbanflow.com",
            "Qa123!",
            UserRole.Member
        );

        var supportAgent = await EnsureUserAsync(
            context,
            "Sergio Support",
            "sergio.support@kanbanflow.com",
            "Support123!",
            UserRole.Member
        );

        await context.SaveChangesAsync();

        var developmentTeam = await EnsureTeamAsync(
            context,
            "Development Team",
            "Main engineering squad",
            admin.Id
        );

        var productTeam = await EnsureTeamAsync(
            context,
            "Product Team",
            "Roadmap and feature delivery",
            productLead.Id
        );

        var designTeam = await EnsureTeamAsync(
            context,
            "Design Team",
            "UX, UI and visual polish",
            designer.Id
        );

        var supportTeam = await EnsureTeamAsync(
            context,
            "Support Team",
            "Customer escalations and documentation",
            supportAgent.Id
        );

        await context.SaveChangesAsync();

        var mainProject = await EnsureProjectAsync(
            context,
            "KanbanFlow SaaS",
            "Main portfolio project",
            developmentTeam.Id
        );

        var redesignProject = await EnsureProjectAsync(
            context,
            "Website Redesign",
            "Refresh the marketing site and onboarding pages",
            designTeam.Id
        );

        var mobileProject = await EnsureProjectAsync(
            context,
            "Mobile Companion",
            "Lightweight mobile experience for task tracking",
            productTeam.Id
        );

        var internalToolsProject = await EnsureProjectAsync(
            context,
            "Internal Tools",
            "Admin utilities and reports",
            developmentTeam.Id
        );

        var supportHubProject = await EnsureProjectAsync(
            context,
            "Customer Success Hub",
            "Knowledge base and support workflows",
            supportTeam.Id
        );

        await context.SaveChangesAsync();

        var task1 = await EnsureTaskAsync(
            context,
            "Create Login UI",
            "Modern auth screen with responsive layout",
            mainProject.Id,
            TaskPriority.High,
            TaskStatus.Done,
            developer.Id,
            DateTime.UtcNow.AddDays(-10)
        );

        var task2 = await EnsureTaskAsync(
            context,
            "Build Dashboard",
            "Statistics, charts and usage KPIs",
            mainProject.Id,
            TaskPriority.Medium,
            TaskStatus.InProgress,
            productLead.Id,
            DateTime.UtcNow.AddDays(3)
        );

        var task3 = await EnsureTaskAsync(
            context,
            "Deploy API",
            "Production deployment pipeline and monitoring",
            mainProject.Id,
            TaskPriority.Urgent,
            TaskStatus.Review,
            admin.Id,
            DateTime.UtcNow.AddDays(1)
        );

        var task4 = await EnsureTaskAsync(
            context,
            "Redesign Landing Page",
            "Hero section, value props and CTA polish",
            redesignProject.Id,
            TaskPriority.High,
            TaskStatus.Todo,
            designer.Id,
            DateTime.UtcNow.AddDays(5)
        );

        var task5 = await EnsureTaskAsync(
            context,
            "Implement Mobile Navigation",
            "Bottom tab bar and quick access actions",
            mobileProject.Id,
            TaskPriority.Medium,
            TaskStatus.InProgress,
            productLead.Id,
            DateTime.UtcNow.AddDays(7)
        );

        var task6 = await EnsureTaskAsync(
            context,
            "Create Usage Report",
            "Weekly activity export for admins",
            internalToolsProject.Id,
            TaskPriority.Low,
            TaskStatus.Todo,
            admin.Id,
            DateTime.UtcNow.AddDays(14)
        );

        var task7 = await EnsureTaskAsync(
            context,
            "Prepare Support Playbook",
            "Standard answers and escalation steps",
            supportHubProject.Id,
            TaskPriority.Medium,
            TaskStatus.Done,
            supportAgent.Id,
            DateTime.UtcNow.AddDays(-2)
        );

        var task8 = await EnsureTaskAsync(
            context,
            "Fix Attachment Preview",
            "Preview images and files from task modal",
            mainProject.Id,
            TaskPriority.High,
            TaskStatus.Todo,
            developer.Id,
            DateTime.UtcNow.AddDays(2)
        );

        var task9 = await EnsureTaskAsync(
            context,
            "Add Team Filters",
            "Allow filtering dashboard data by team",
            redesignProject.Id,
            TaskPriority.Medium,
            TaskStatus.InProgress,
            productLead.Id,
            DateTime.UtcNow.AddDays(4)
        );

        var task10 = await EnsureTaskAsync(
            context,
            "QA Critical Flows",
            "Smoke test login, dashboard and task actions",
            mobileProject.Id,
            TaskPriority.Urgent,
            TaskStatus.Review,
            qaEngineer.Id,
            DateTime.UtcNow.AddDays(1)
        );

        await context.SaveChangesAsync();

        await EnsureCommentAsync(
            context,
            task1.Id,
            admin.Id,
            "Login is ready. We should verify the mobile breakpoint next."
        );

        await EnsureCommentAsync(
            context,
            task2.Id,
            productLead.Id,
            "Charts look good. Let's add a productivity trend line later."
        );

        await EnsureCommentAsync(
            context,
            task3.Id,
            developer.Id,
            "Deployment succeeded. Keep an eye on API logs for the first hour."
        );

        await EnsureCommentAsync(
            context,
            task4.Id,
            designer.Id,
            "The new hero copy is approved. Need final icon refinement."
        );

        await EnsureCommentAsync(
            context,
            task5.Id,
            productLead.Id,
            "Navigation is in progress, waiting for a quick QA pass."
        );

        await EnsureCommentAsync(
            context,
            task7.Id,
            supportAgent.Id,
            "Playbook published. Support can start using it today."
        );

        await EnsureCommentAsync(
            context,
            task10.Id,
            qaEngineer.Id,
            "Critical flows are green except the attachment download edge case."
        );

        await context.SaveChangesAsync();

        var storageSeedDir = Path.Combine(
            AppContext.BaseDirectory,
            "Storage",
            "seed"
        );

        Directory.CreateDirectory(
            storageSeedDir
        );

        var seedFiles = new List<(string FileName, string Content)>
        {
            (
                "release-notes.txt",
                "KanbanFlow seed release notes\n- Login flow verified\n- Dashboard stats loaded\n- Projects and teams ready for demo"
            ),
            (
                "qa-checklist.md",
                "# QA Checklist\n- Login\n- Dashboard\n- Projects\n- Teams\n- Tasks\n- Attachments"
            ),
            (
                "design-brief.txt",
                "Seeded design brief for the website redesign project."
            ),
            (
                "support-playbook.txt",
                "Support playbook seed file for customer success demo data."
            )
        };

        foreach (var file in seedFiles)
        {
            var fullPath = Path.Combine(
                storageSeedDir,
                file.FileName
            );

            if (!File.Exists(fullPath))
            {
                await File.WriteAllTextAsync(
                    fullPath,
                    file.Content
                );
            }
        }

        await EnsureAttachmentAsync(
            context,
            task1.Id,
            admin.Id,
            "release-notes.txt",
            "/storage/seed/release-notes.txt",
            "text/plain",
            117
        );

        await EnsureAttachmentAsync(
            context,
            task4.Id,
            designer.Id,
            "design-brief.txt",
            "/storage/seed/design-brief.txt",
            "text/plain",
            54
        );

        await EnsureAttachmentAsync(
            context,
            task7.Id,
            supportAgent.Id,
            "support-playbook.txt",
            "/storage/seed/support-playbook.txt",
            "text/plain",
            60
        );

        await EnsureAttachmentAsync(
            context,
            task10.Id,
            qaEngineer.Id,
            "qa-checklist.md",
            "/storage/seed/qa-checklist.md",
            "text/markdown",
            81
        );

        await context.SaveChangesAsync();
    }

    private static async Task<User> EnsureUserAsync(
        KanbanDbContext context,
        string name,
        string email,
        string password,
        UserRole role
    )
    {
        var user = await context.Users
            .FirstOrDefaultAsync(
                x => x.Email == email
            );

        if (user is null)
        {
            user = new User
            {
                Name = name,

                Email = email,

                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        password
                    ),

                Role = role
            };

            context.Users.Add(
                user
            );
        }
        else
        {
            user.Name = name;

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    password
                );

            user.Role = role;
        }

        return user;
    }

    private static async Task<Team> EnsureTeamAsync(
        KanbanDbContext context,
        string name,
        string description,
        int ownerId
    )
    {
        var team = await context.Teams
            .FirstOrDefaultAsync(
                x => x.Name == name
            );

        if (team is null)
        {
            team = new Team
            {
                Name = name,

                Description = description,

                OwnerId = ownerId
            };

            context.Teams.Add(
                team
            );
        }
        else
        {
            team.Description = description;

            team.OwnerId = ownerId;
        }

        return team;
    }

    private static async Task<Project> EnsureProjectAsync(
        KanbanDbContext context,
        string name,
        string description,
        int teamId
    )
    {
        var project = await context.Projects
            .FirstOrDefaultAsync(
                x => x.Name == name
                    && x.TeamId == teamId
            );

        if (project is null)
        {
            project = new Project
            {
                Name = name,

                Description = description,

                TeamId = teamId
            };

            context.Projects.Add(
                project
            );
        }
        else
        {
            project.Description = description;
        }

        return project;
    }

    private static async Task<TaskItem> EnsureTaskAsync(
        KanbanDbContext context,
        string title,
        string description,
        int projectId,
        TaskPriority priority,
        TaskStatus status,
        int? assigneeId,
        DateTime? dueDate
    )
    {
        var task = await context.Tasks
            .FirstOrDefaultAsync(
                x => x.Title == title
                    && x.ProjectId == projectId
            );

        if (task is null)
        {
            task = new TaskItem
            {
                Title = title,

                Description = description,

                ProjectId = projectId,

                Priority = priority,

                Status = status,

                AssigneeId = assigneeId,

                DueDate = dueDate
            };

            context.Tasks.Add(
                task
            );
        }
        else
        {
            task.Description = description;

            task.Priority = priority;

            task.Status = status;

            task.AssigneeId = assigneeId;

            task.DueDate = dueDate;
        }

        return task;
    }

    private static async Task EnsureCommentAsync(
        KanbanDbContext context,
        int taskId,
        int userId,
        string content
    )
    {
        var exists = await context.TaskComments
            .AnyAsync(
                x => x.TaskItemId == taskId
                    && x.UserId == userId
                    && x.Content == content
            );

        if (!exists)
        {
            context.TaskComments.Add(
                new TaskComment
                {
                    Content = content,

                    TaskItemId = taskId,

                    UserId = userId
                }
            );
        }
    }

    private static async Task EnsureAttachmentAsync(
        KanbanDbContext context,
        int taskId,
        int uploadedById,
        string fileName,
        string filePath,
        string fileType,
        long fileSize
    )
    {
        var exists = await context.TaskAttachments
            .AnyAsync(
                x => x.TaskItemId == taskId
                    && x.FileName == fileName
                    && x.FilePath == filePath
            );

        if (!exists)
        {
            context.TaskAttachments.Add(
                new TaskAttachment
                {
                    FileName = fileName,

                    FilePath = filePath,

                    FileType = fileType,

                    FileSize = fileSize,

                    TaskItemId = taskId,

                    UploadedById = uploadedById
                }
            );
        }
    }
}