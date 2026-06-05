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

        var marketingLead = await EnsureUserAsync(
            context,
            "Marta Marketing",
            "marta.marketing@kanbanflow.com",
            "Marketing123!",
            UserRole.Manager
        );

        var operationsLead = await EnsureUserAsync(
            context,
            "Ivan Ops",
            "ivan.ops@kanbanflow.com",
            "Ops123!",
            UserRole.Manager
        );

        var contentStrategist = await EnsureUserAsync(
            context,
            "Clara Content",
            "clara.content@kanbanflow.com",
            "Content123!",
            UserRole.Member
        );

        var financeLead = await EnsureUserAsync(
            context,
            "Mila Finance",
            "mila.finance@kanbanflow.com",
            "Finance123!",
            UserRole.Manager
        );

        var salesLead = await EnsureUserAsync(
            context,
            "Pedro Sales",
            "pedro.sales@kanbanflow.com",
            "Sales123!",
            UserRole.Manager
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

        var marketingTeam = await EnsureTeamAsync(
            context,
            "Marketing Team",
            "Campaigns, messaging and launch coordination",
            marketingLead.Id
        );

        var operationsTeam = await EnsureTeamAsync(
            context,
            "Operations Team",
            "Infrastructure, reliability and internal tooling",
            operationsLead.Id
        );

        var contentTeam = await EnsureTeamAsync(
            context,
            "Content Team",
            "Documentation, SEO and educational content",
            contentStrategist.Id
        );

        var financeTeam = await EnsureTeamAsync(
            context,
            "Finance Team",
            "Billing, forecasting and reporting",
            financeLead.Id
        );

        var salesTeam = await EnsureTeamAsync(
            context,
            "Sales Team",
            "Pipeline, deals and customer outreach",
            salesLead.Id
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

        var launchCampaignProject = await EnsureProjectAsync(
            context,
            "Q3 Launch Campaign",
            "Launch planning, ads and email automation",
            marketingTeam.Id
        );

        var opsMonitoringProject = await EnsureProjectAsync(
            context,
            "Ops Monitoring Center",
            "Dashboards, alerts and incident visibility",
            operationsTeam.Id
        );

        var seoProject = await EnsureProjectAsync(
            context,
            "SEO Sprint",
            "Search optimization and landing page improvements",
            marketingTeam.Id
        );

        var contentLibraryProject = await EnsureProjectAsync(
            context,
            "Brand Content Library",
            "Reusable copy, docs and campaign assets",
            contentTeam.Id
        );

        var helpCenterProject = await EnsureProjectAsync(
            context,
            "Help Center Revamp",
            "Improve article structure and self-service support",
            supportTeam.Id
        );

        var billingPortalProject = await EnsureProjectAsync(
            context,
            "Billing Portal",
            "Invoices, subscriptions and payment history",
            financeTeam.Id
        );

        var salesPipelineProject = await EnsureProjectAsync(
            context,
            "Sales Pipeline Revamp",
            "Lead stages, automation and conversion tracking",
            salesTeam.Id
        );

        var partnerPortalProject = await EnsureProjectAsync(
            context,
            "Partner Portal",
            "External partner onboarding and resource center",
            salesTeam.Id
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

        var task11 = await EnsureTaskAsync(
            context,
            "Plan Q3 Launch",
            "Align the campaign timeline across marketing and product",
            launchCampaignProject.Id,
            TaskPriority.Urgent,
            TaskStatus.InProgress,
            marketingLead.Id,
            DateTime.UtcNow.AddDays(6)
        );

        var task12 = await EnsureTaskAsync(
            context,
            "Build Incident Dashboard",
            "Track uptime, alerts and incident response metrics",
            opsMonitoringProject.Id,
            TaskPriority.High,
            TaskStatus.Todo,
            operationsLead.Id,
            DateTime.UtcNow.AddDays(9)
        );

        var task13 = await EnsureTaskAsync(
            context,
            "Write SEO Audit",
            "Review keywords, metadata and page structure",
            seoProject.Id,
            TaskPriority.Medium,
            TaskStatus.InProgress,
            contentStrategist.Id,
            DateTime.UtcNow.AddDays(4)
        );

        var task14 = await EnsureTaskAsync(
            context,
            "Curate Brand Assets",
            "Keep reusable headlines, visuals and CTA copy organized",
            contentLibraryProject.Id,
            TaskPriority.Low,
            TaskStatus.Done,
            designer.Id,
            DateTime.UtcNow.AddDays(-4)
        );

        var task15 = await EnsureTaskAsync(
            context,
            "Update Help Center Categories",
            "Restructure articles for quicker discovery",
            helpCenterProject.Id,
            TaskPriority.High,
            TaskStatus.InProgress,
            supportAgent.Id,
            DateTime.UtcNow.AddDays(3)
        );

        var task16 = await EnsureTaskAsync(
            context,
            "Prepare Launch Email",
            "Draft the launch announcement and follow-up sequence",
            launchCampaignProject.Id,
            TaskPriority.Medium,
            TaskStatus.Todo,
            marketingLead.Id,
            DateTime.UtcNow.AddDays(2)
        );

        var task17 = await EnsureTaskAsync(
            context,
            "Document Incident Playbook",
            "Summarize escalation and rollback steps for ops",
            opsMonitoringProject.Id,
            TaskPriority.Medium,
            TaskStatus.Done,
            operationsLead.Id,
            DateTime.UtcNow.AddDays(-1)
        );

        var task18 = await EnsureTaskAsync(
            context,
            "Improve Search Snippets",
            "Add preview copy for SEO pages and meta descriptions",
            seoProject.Id,
            TaskPriority.High,
            TaskStatus.Review,
            contentStrategist.Id,
            DateTime.UtcNow.AddDays(5)
        );

        var task19 = await EnsureTaskAsync(
            context,
            "Reconcile Monthly Billing",
            "Match invoices, subscriptions and payments",
            billingPortalProject.Id,
            TaskPriority.Urgent,
            TaskStatus.InProgress,
            financeLead.Id,
            DateTime.UtcNow.AddDays(2)
        );

        var task20 = await EnsureTaskAsync(
            context,
            "Prepare Forecast Report",
            "Summarize quarter projections for leadership",
            billingPortalProject.Id,
            TaskPriority.Medium,
            TaskStatus.Todo,
            financeLead.Id,
            DateTime.UtcNow.AddDays(6)
        );

        var task21 = await EnsureTaskAsync(
            context,
            "Design Lead Scoring",
            "Prioritize high-intent leads in the pipeline",
            salesPipelineProject.Id,
            TaskPriority.High,
            TaskStatus.InProgress,
            salesLead.Id,
            DateTime.UtcNow.AddDays(3)
        );

        var task22 = await EnsureTaskAsync(
            context,
            "Create Partner Signup Flow",
            "Invite external partners through a guided flow",
            partnerPortalProject.Id,
            TaskPriority.Medium,
            TaskStatus.Todo,
            salesLead.Id,
            DateTime.UtcNow.AddDays(8)
        );

        var task23 = await EnsureTaskAsync(
            context,
            "Add Subscription Alerts",
            "Notify finance when renewals are close to expiring",
            billingPortalProject.Id,
            TaskPriority.Low,
            TaskStatus.Done,
            financeLead.Id,
            DateTime.UtcNow.AddDays(-3)
        );

        var task24 = await EnsureTaskAsync(
            context,
            "Publish Partner Resources",
            "Upload onboarding guides and program assets",
            partnerPortalProject.Id,
            TaskPriority.Medium,
            TaskStatus.Review,
            supportAgent.Id,
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

        await EnsureCommentAsync(
            context,
            task11.Id,
            marketingLead.Id,
            "Campaign calendar is drafted. Waiting on final approval from product."
        );

        await EnsureCommentAsync(
            context,
            task12.Id,
            operationsLead.Id,
            "We should wire alerts to Slack and add a basic uptime widget."
        );

        await EnsureCommentAsync(
            context,
            task13.Id,
            contentStrategist.Id,
            "Keyword list is ready. Next step is refining the intro sections."
        );

        await EnsureCommentAsync(
            context,
            task15.Id,
            supportAgent.Id,
            "Article taxonomy looks cleaner already. Need one final pass on labels."
        );

        await EnsureCommentAsync(
            context,
            task18.Id,
            designer.Id,
            "Search snippets will match the refreshed content once we merge the copy."
        );

        await EnsureCommentAsync(
            context,
            task19.Id,
            financeLead.Id,
            "Billing reconciliation is half done. Waiting for one payment provider export."
        );

        await EnsureCommentAsync(
            context,
            task21.Id,
            salesLead.Id,
            "Lead scoring should surface high-value opportunities for the team."
        );

        await EnsureCommentAsync(
            context,
            task22.Id,
            salesLead.Id,
            "Partner signup needs fewer steps and a clearer confirmation screen."
        );

        await EnsureCommentAsync(
            context,
            task24.Id,
            supportAgent.Id,
            "Resources are ready; we just need the final review from sales."
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
            ),
            (
                "launch-email.md",
                "# Launch Email\n\nAnnounce the Q3 launch with a short value-driven message."
            ),
            (
                "incident-playbook.txt",
                "Incident playbook seed file for operational response and escalation."
            ),
            (
                "seo-audit.txt",
                "SEO audit summary for seeded analytics and landing page improvements."
            ),
            (
                "content-library.txt",
                "Brand content library notes with approved headlines and CTA copy."
            ),
            (
                "billing-summary.txt",
                "Billing portal seed file with invoice and subscription notes."
            ),
            (
                "sales-playbook.txt",
                "Sales pipeline seed file with conversion and lead tracking notes."
            ),
            (
                "partner-onboarding.txt",
                "Partner portal seed file with onboarding steps and resource links."
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

        await EnsureAttachmentAsync(
            context,
            task11.Id,
            marketingLead.Id,
            "launch-email.md",
            "/storage/seed/launch-email.md",
            "text/markdown",
            74
        );

        await EnsureAttachmentAsync(
            context,
            task12.Id,
            operationsLead.Id,
            "incident-playbook.txt",
            "/storage/seed/incident-playbook.txt",
            "text/plain",
            68
        );

        await EnsureAttachmentAsync(
            context,
            task13.Id,
            contentStrategist.Id,
            "seo-audit.txt",
            "/storage/seed/seo-audit.txt",
            "text/plain",
            70
        );

        await EnsureAttachmentAsync(
            context,
            task14.Id,
            designer.Id,
            "content-library.txt",
            "/storage/seed/content-library.txt",
            "text/plain",
            66
        );

        await EnsureAttachmentAsync(
            context,
            task19.Id,
            financeLead.Id,
            "billing-summary.txt",
            "/storage/seed/billing-summary.txt",
            "text/plain",
            61
        );

        await EnsureAttachmentAsync(
            context,
            task21.Id,
            salesLead.Id,
            "sales-playbook.txt",
            "/storage/seed/sales-playbook.txt",
            "text/plain",
            65
        );

        await EnsureAttachmentAsync(
            context,
            task22.Id,
            salesLead.Id,
            "partner-onboarding.txt",
            "/storage/seed/partner-onboarding.txt",
            "text/plain",
            68
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