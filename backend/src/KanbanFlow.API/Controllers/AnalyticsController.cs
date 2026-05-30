using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController
    : ControllerBase
{
    private readonly KanbanDbContext
        _context;

    public AnalyticsController(
        KanbanDbContext context
    )
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult>
        GetDashboard()
    {
        var totalTasks =
            await _context.Tasks
                .CountAsync();

        var completedTasks =
            await _context.Tasks
                .CountAsync(
                    x => x.Status
                        .ToString()
                        == "Done"
                );

        var inProgressTasks =
            await _context.Tasks
                .CountAsync(
                    x => x.Status
                        .ToString()
                        == "InProgress"
                );

        var totalProjects =
            await _context.Projects
                .CountAsync();

        var totalUsers =
            await _context.Users
                .CountAsync();

        var productivity =
            totalTasks == 0
                ? 0
                : (
                    (
                        double)
                        completedTasks
                    / totalTasks
                  ) * 100;

        var tasksByPriority =
            await _context.Tasks
                .GroupBy(
                    x => x.Priority
                        .ToString()
                )
                .Select(
                    x => new
                    {
                        priority =
                            x.Key,

                        count =
                            x.Count()
                    }
                )
                .ToListAsync();

        var tasksByStatus =
            await _context.Tasks
                .GroupBy(
                    x => x.Status
                        .ToString()
                )
                .Select(
                    x => new
                    {
                        status =
                            x.Key,

                        count =
                            x.Count()
                    }
                )
                .ToListAsync();

        return Ok(
            new
            {
                totalTasks,

                completedTasks,

                inProgressTasks,

                totalProjects,

                totalUsers,

                productivity,

                tasksByPriority,

                tasksByStatus
            }
        );
    }
}