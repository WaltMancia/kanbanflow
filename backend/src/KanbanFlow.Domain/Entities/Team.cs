namespace KanbanFlow.Domain.Entities;

public class Team : BaseEntity
{
    public string Name { get; set; } = "";

    public string Description { get; set; } = "";

    public int OwnerId { get; set; }

    public User? Owner { get; set; }

    public ICollection<Project> Projects
    { get; set; }
        = new List<Project>();
}