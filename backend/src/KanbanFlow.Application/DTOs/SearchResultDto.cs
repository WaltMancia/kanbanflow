namespace KanbanFlow.Application.DTOs.Search;

public class SearchResultDto
{
    public IEnumerable<object>
        Projects
    { get; set; }
        = [];

    public IEnumerable<object>
        Tasks
    { get; set; }
        = [];

    public IEnumerable<object>
        Users
    { get; set; }
        = [];

    public IEnumerable<object>
        Teams
    { get; set; }
        = [];
}