using KanbanFlow.Domain.Enums;
using TaskStatus = KanbanFlow.Domain.Enums.TaskStatus;

namespace KanbanFlow.Domain.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public TaskPriority Priority { get; set; }
        = TaskPriority.Medium;

    public TaskStatus Status { get; set; }
        = TaskStatus.Todo;

    public int ProjectId { get; set; }

    public Project? Project { get; set; }

    public int? AssigneeId { get; set; }

    public User? Assignee { get; set; }

    public DateTime? DueDate { get; set; }
}