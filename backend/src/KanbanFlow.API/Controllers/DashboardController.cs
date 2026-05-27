using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController
    : ControllerBase
{
    private readonly KanbanDbContext _context;

    public DashboardController(
        KanbanDbContext context
    )
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalProjects =
            await _context.Projects.CountAsync();

        var totalTeams =
            await _context.Teams.CountAsync();

        var totalTasks =
            await _context.Tasks.CountAsync();

        var completedTasks =
            await _context.Tasks.CountAsync(
                x => x.Status.ToString()
                    == "Done"
            );

        var productivity =
            totalTasks == 0
                ? 0
                : (completedTasks * 100)
                    / totalTasks;

        var tasksPerStatus =
            await _context.Tasks
                .GroupBy(x => x.Status)
                .Select(x => new
                {
                    status =
                        x.Key.ToString(),

                    count = x.Count()
                })
                .ToListAsync();

        var priorities =
            await _context.Tasks
                .GroupBy(x => x.Priority)
                .Select(x => new
                {
                    priority =
                        x.Key.ToString(),

                    count = x.Count()
                })
                .ToListAsync();

        return Ok(new
        {
            totalProjects,
            totalTeams,
            totalTasks,
            completedTasks,
            productivity,
            tasksPerStatus,
            priorities
        });
    }
}