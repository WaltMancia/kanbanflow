namespace KanbanFlow.Application.DTOs.Tasks;

public class UpdateTaskDto
{
    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public string Priority { get; set; } = "Medium";
}
