namespace KanbanFlow.Application.DTOs.Tasks;

public class CreateCommentDto
{
    public string Content { get; set; }
        = "";

    public int TaskItemId { get; set; }
}