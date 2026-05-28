namespace KanbanFlow.Domain.Entities;

public class TaskComment : BaseEntity
{
    public string Content { get; set; }
        = "";

    public int TaskItemId { get; set; }

    public TaskItem? TaskItem { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }
}