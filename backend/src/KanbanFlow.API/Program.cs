using KanbanFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using KanbanFlow.Application.Interfaces;
using KanbanFlow.Infrastructure.Security;
using KanbanFlow.Infrastructure.Data.Seed;
using KanbanFlow.API.Hubs;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddDbContext<KanbanDbContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString(
            "DefaultConnection"
        );

    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    );
});

var jwtKey =
    builder.Configuration["Jwt:Key"];

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme
)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],

            ValidAudience =
                builder.Configuration["Jwt:Audience"],

            IssuerSigningKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey!)
                )
        };
});

builder.Services.AddAuthorization();

builder.Services.AddSignalR();

builder.Services.AddScoped<
    IJwtService,
    JwtService
>();

builder.Services.AddScoped<
    IPasswordService,
    PasswordService
>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<KanbanDbContext>();

    await DatabaseSeeder.SeedAsync(db);
}

app.MapHub<KanbanHub>(
    "/hubs/kanban"
).RequireCors("AllowFrontend");

var uploadsPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Storage"
);

if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(
        uploadsPath
    );
}

app.UseStaticFiles(
    new StaticFileOptions
    {
        FileProvider =
            new PhysicalFileProvider(
                uploadsPath
            ),

        RequestPath =
            "/storage"
    }
);

app.Run();