namespace KanbanFlow.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public string Status { get; set; }
        = "Active";

    public int TeamId { get; set; }

    public Team? Team { get; set; }
}