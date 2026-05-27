namespace KanbanFlow.Application.DTOs.Tasks;

public class CreateTaskDto
{
    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public int ProjectId { get; set; }

    public string Priority { get; set; }
        = "Medium";
}