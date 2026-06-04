using KanbanFlow.API.Hubs;

using KanbanFlow.Application.DTOs.Tasks;
using KanbanFlow.Domain.Entities;
using KanbanFlow.Domain.Enums;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController
    : ControllerBase
{
    private readonly KanbanDbContext _context;

    private readonly IHubContext<KanbanHub>
        _hub;

    public TasksController(
        KanbanDbContext context,
        IHubContext<KanbanHub> hub
    )
    {
        _context = context;
        _hub = hub;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Tasks
            .Include(x => x.Project)
            .Include(x => x.Assignee)
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(
        CreateTaskDto dto
    )
    {
        Enum.TryParse<TaskPriority>(
            dto.Priority,
            true,
            out var priority
        );

        var task = new TaskItem
        {
            Title = dto.Title,

            Description =
                dto.Description,

            ProjectId = dto.ProjectId,

            Priority = priority
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        // ===== REALTIME EVENT =====

        await _hub.Clients.All.SendAsync(
            "TaskCreated",
            task
        );

        return Ok(task);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult>
        UpdateStatus(
            int id,
            UpdateTaskStatusDto dto
        )
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(
                x => x.Id == id
            );

        if (task == null)
        {
            return NotFound();
        }

        Enum.TryParse<Domain.Enums.TaskStatus>(
            dto.Status,
            true,
            out var status
        );

        task.Status = status;

        await _context.SaveChangesAsync();

        // ===== REALTIME EVENT =====

        await _hub.Clients.All.SendAsync(
            "TaskUpdated",
            task
        );

        return Ok(task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(
        int id,
        UpdateTaskDto dto
    )
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        Enum.TryParse<TaskPriority>(
            dto.Priority,
            true,
            out var priority
        );

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = priority;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // ===== REALTIME EVENT =====

        await _hub.Clients.All.SendAsync(
            "TaskUpdated",
            task
        );

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(x => x.Id == id);

        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);

        await _context.SaveChangesAsync();

        // ===== REALTIME EVENT =====

        await _hub.Clients.All.SendAsync(
            "TaskDeleted",
            id
        );

        return Ok(new { id });
    }
}