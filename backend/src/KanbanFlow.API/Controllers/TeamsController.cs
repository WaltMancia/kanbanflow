using System.Security.Claims;

using KanbanFlow.Application.DTOs.Teams;
using KanbanFlow.Domain.Entities;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeamsController : ControllerBase
{
    private readonly KanbanDbContext _context;

    public TeamsController(
        KanbanDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTeams()
    {
        var teams = await _context.Teams
            .Include(x => x.Owner)
            .ToListAsync();

        return Ok(teams);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTeam(
        CreateTeamDto dto
    )
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )!
        );

        var team = new Team
        {
            Name = dto.Name,

            Description =
                dto.Description,

            OwnerId = userId
        };

        _context.Teams.Add(team);

        await _context.SaveChangesAsync();

        return Ok(team);
    }
}