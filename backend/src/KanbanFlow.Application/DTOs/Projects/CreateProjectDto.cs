namespace KanbanFlow.Application.DTOs.Projects;

public class CreateProjectDto
{
    public string Name { get; set; } = "";

    public string Description { get; set; }
        = "";

    public int TeamId { get; set; }
}