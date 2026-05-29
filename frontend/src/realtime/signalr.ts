import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(
    import.meta.env.VITE_SIGNALR_URL ?? "http://localhost:5298/hubs/kanban",
    {
      accessTokenFactory: () => localStorage.getItem("token") || "",
    },
  )
  .withAutomaticReconnect()
  .build();
