using System.Security.Claims;

using KanbanFlow.API.Hubs;
using KanbanFlow.Application.DTOs.Tasks;
using KanbanFlow.Domain.Entities;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommentsController
    : ControllerBase
{
    private readonly KanbanDbContext
        _context;

    private readonly IHubContext<KanbanHub>
        _hub;

    public CommentsController(
        KanbanDbContext context,
        IHubContext<KanbanHub> hub
    )
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet("{taskId}")]
    public async Task<IActionResult>
        GetComments(int taskId)
    {
        var comments =
            await _context.TaskComments
                .Include(x => x.User)
                .Where(
                    x => x.TaskItemId
                        == taskId
                )
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .ToListAsync();

        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult>
        CreateComment(
            CreateCommentDto dto
        )
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )!
        );

        var comment =
            new TaskComment
            {
                Content =
                    dto.Content,

                TaskItemId =
                    dto.TaskItemId,

                UserId = userId
            };

        _context.TaskComments.Add(
            comment
        );

        await _context.SaveChangesAsync();

        var created =
            await _context.TaskComments
                .Include(x => x.User)
                .FirstAsync(
                    x => x.Id
                        == comment.Id
                );

        await _hub.Clients.All.SendAsync(
            "CommentCreated",
            created
        );

        return Ok(created);
    }
}