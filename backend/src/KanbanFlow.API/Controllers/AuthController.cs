using KanbanFlow.Application.DTOs.Auth;
using KanbanFlow.Application.Interfaces;
using KanbanFlow.Domain.Entities;
using KanbanFlow.Domain.Enums;
using KanbanFlow.Infrastructure.Data;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KanbanFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly KanbanDbContext _context;

    private readonly IJwtService _jwtService;

    private readonly IPasswordService _passwordService;

    public AuthController(
        KanbanDbContext context,
        IJwtService jwtService,
        IPasswordService passwordService
    )
    {
        _context = context;

        _jwtService = jwtService;

        _passwordService = passwordService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequestDto dto
    )
    {
        var exists = await _context.Users
            .AnyAsync(x => x.Email == dto.Email);

        if (exists)
        {
            return BadRequest(new
            {
                message = "Email already exists"
            });
        }

        var user = new User
        {
            Name = dto.Name,

            Email = dto.Email,

            PasswordHash =
                _passwordService.HashPassword(
                    dto.Password
                ),

            Role = UserRole.Member
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token =
            _jwtService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,

            Name = user.Name,

            Email = user.Email,

            Role = user.Role.ToString()
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequestDto dto
    )
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Email == dto.Email
            );

        if (
            user == null ||
            !_passwordService.VerifyPassword(
                dto.Password,
                user.PasswordHash
            )
        )
        {
            return Unauthorized(new
            {
                message = "Invalid credentials"
            });
        }

        var token =
            _jwtService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,

            Name = user.Name,

            Email = user.Email,

            Role = user.Role.ToString()
        });
    }
}