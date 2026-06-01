using KanbanFlow.Application.DTOs.Projects;
using KanbanFlow.Domain.Entities;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController
    : ControllerBase
{
    private readonly KanbanDbContext _context;

    public ProjectsController(
        KanbanDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult>
        GetProjects()
    {
        var projects =
            await _context.Projects
                .Include(x => x.Team)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Description,
                    Team = x.Team == null
                        ? null
                        : new
                        {
                            x.Team.Id,
                            x.Team.Name
                        }
                })
                .ToListAsync();

        return Ok(projects);
    }

    [HttpPost]
    public async Task<IActionResult>
        CreateProject(
            CreateProjectDto dto
        )
    {
        var project = new Project
        {
            Name = dto.Name,

            Description =
                dto.Description,

            TeamId = dto.TeamId
        };

        _context.Projects.Add(project);

        await _context.SaveChangesAsync();

        return Ok(project);
    }
}