namespace KanbanFlow.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = "";

    public string Email { get; set; } = "";

    public string PasswordHash { get; set; } = "";

    public string Role { get; set; } = "member";

    public bool IsActive { get; set; } = true;
}