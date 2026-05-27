using KanbanFlow.Domain.Enums;

namespace KanbanFlow.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = "";

    public string Email { get; set; } = "";

    public string PasswordHash { get; set; } = "";

    public UserRole Role { get; set; }
        = UserRole.Member;

    public bool IsActive { get; set; }
        = true;
}