using KanbanFlow.Domain.Entities;

namespace KanbanFlow.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}