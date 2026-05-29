using System.Security.Claims;

using KanbanFlow.Domain.Entities;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttachmentsController
    : ControllerBase
{
    private readonly IWebHostEnvironment
        _environment;

    private readonly KanbanDbContext
        _context;

    public AttachmentsController(
        IWebHostEnvironment environment,
        KanbanDbContext context
    )
    {
        _environment = environment;
        _context = context;
    }

    [HttpGet("{taskId}")]
    public async Task<IActionResult>
        GetAttachments(int taskId)
    {
        var files =
            await _context.TaskAttachments
                .Include(
                    x => x.UploadedBy
                )
                .Where(
                    x => x.TaskItemId
                        == taskId
                )
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .ToListAsync();

        return Ok(files);
    }

    [HttpPost]
    [RequestSizeLimit(50_000_000)]
    public async Task<IActionResult>
        Upload(
            IFormFile file,
            [FromForm] int taskItemId
        )
    {
        if (file.Length <= 0)
        {
            return BadRequest(
                "Invalid file"
            );
        }

        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            )!
        );

        var uploadsFolder = Path.Combine(
            _environment.ContentRootPath,
            "Storage"
        );

        if (
            !Directory.Exists(
                uploadsFolder
            )
        )
        {
            Directory.CreateDirectory(
                uploadsFolder
            );
        }

        var uniqueFileName =
            $"{Guid.NewGuid()}_{file.FileName}";

        var filePath = Path.Combine(
            uploadsFolder,
            uniqueFileName
        );

        using (
            var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                )
        )
        {
            await file.CopyToAsync(
                stream
            );
        }

        var attachment =
            new TaskAttachment
            {
                FileName =
                    file.FileName,

                FilePath =
                    $"/storage/{uniqueFileName}",

                FileType =
                    file.ContentType,

                FileSize =
                    file.Length,

                TaskItemId =
                    taskItemId,

                UploadedById =
                    userId
            };

        _context.TaskAttachments.Add(
            attachment
        );

        await _context.SaveChangesAsync();

        return Ok(attachment);
    }
}