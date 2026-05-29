namespace KanbanFlow.Domain.Entities;

public class TaskAttachment
    : BaseEntity
{
    public string FileName { get; set; }
        = "";

    public string FilePath { get; set; }
        = "";

    public string FileType { get; set; }
        = "";

    public long FileSize { get; set; }

    public int TaskItemId { get; set; }

    public TaskItem? TaskItem { get; set; }

    public int UploadedById { get; set; }

    public User? UploadedBy { get; set; }
}