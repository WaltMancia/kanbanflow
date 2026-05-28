import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hubs/kanban", {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .build();
