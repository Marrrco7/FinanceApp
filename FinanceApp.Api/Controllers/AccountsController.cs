using FinanceApp.Domain.Accounts;
using FinanceApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController(FinanceDbContext context) : ControllerBase
{
    private readonly FinanceDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Account>>> GetAll()
    {
        var accounts = await _context.Accounts
            .OrderBy(a => a.Name)
            .ToListAsync();

        return Ok(accounts);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Account>> GetById(Guid id)
    {
        var account = await _context.Accounts.FindAsync(id);

        if (account is null)
        {
            return NotFound();
        }

        return Ok(account);
    }

    [HttpPost]
    public async Task<ActionResult<Account>> Create(CreateAccountRequest request)
    {
        var account = new Account
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            AccountType = request.AccountType,
            InitialBalance = request.InitialBalance,
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = account.Id }, account);
    }

    public record CreateAccountRequest(
        string Name,
        AccountType AccountType,
        decimal InitialBalance
    );
}