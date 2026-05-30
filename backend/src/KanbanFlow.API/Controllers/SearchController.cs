using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class SearchController
    : ControllerBase
{
    private readonly KanbanDbContext
        _context;

    public SearchController(
        KanbanDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult>
        Search(
            [FromQuery]
            string q
        )
    {
        if (
            string.IsNullOrWhiteSpace(
                q
            )
        )
        {
            return Ok(
                new
                {
                    projects =
                        Array.Empty<object>(),

                    tasks =
                        Array.Empty<object>(),

                    users =
                        Array.Empty<object>(),

                    teams =
                        Array.Empty<object>()
                }
            );
        }

        q = q.Trim();

        var projects =
            await _context.Projects
                .Where(
                    x =>
                        x.Name.Contains(q)
                )
                .Take(5)
                .Select(
                    x => new
                    {
                        x.Id,
                        x.Name
                    }
                )
                .ToListAsync();

        var tasks =
            await _context.Tasks
                .Where(
                    x =>
                        x.Title.Contains(q)
                )
                .Take(5)
                .Select(
                    x => new
                    {
                        x.Id,
                        x.Title
                    }
                )
                .ToListAsync();

        var users =
            await _context.Users
                .Where(
                    x =>
                        x.FullName.Contains(q)
                )
                .Take(5)
                .Select(
                    x => new
                    {
                        x.Id,
                        x.FullName
                    }
                )
                .ToListAsync();

        var teams =
            await _context.Teams
                .Where(
                    x =>
                        x.Name.Contains(q)
                )
                .Take(5)
                .Select(
                    x => new
                    {
                        x.Id,
                        x.Name
                    }
                )
                .ToListAsync();

        return Ok(
            new
            {
                projects,
                tasks,
                users,
                teams
            }
        );
    }
}