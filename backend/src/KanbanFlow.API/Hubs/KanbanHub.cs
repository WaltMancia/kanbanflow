using Microsoft.AspNetCore.SignalR;

namespace KanbanFlow.API.Hubs;

public class KanbanHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendAsync(
            "UserConnected",
            Context.ConnectionId
        );

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(
        Exception? exception
    )
    {
        await Clients.All.SendAsync(
            "UserDisconnected",
            Context.ConnectionId
        );

        await base.OnDisconnectedAsync(
            exception
        );
    }
}