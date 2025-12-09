using FinanceApp.Domain.Transactions;
using FinanceApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController(FinanceDbContext context) : ControllerBase
{
    private readonly FinanceDbContext _context = context;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetAll(
        [FromQuery] Guid? accountId,
        [FromQuery] Guid? categoryId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var query = _context.Transactions.AsQueryable();

        if (accountId.HasValue)
            query = query.Where(t => t.AccountId == accountId.Value);

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        if (from.HasValue)
            query = query.Where(t => t.Date >= from.Value);

        if (to.HasValue)
            query = query.Where(t => t.Date <= to.Value);

        var transactions = await query
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(transactions);
    }

    // GET: api/Transactions/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Transaction>> GetById(Guid id)
    {
        var transaction = await _context.Transactions.FindAsync(id);

        if (transaction is null)
            return NotFound();

        return Ok(transaction);
    }

    // POST: api/Transactions
    [HttpPost]
    public async Task<ActionResult<Transaction>> Create(CreateTransactionRequest request)
    {
        // Optional: basic validation: make sure account exists
        var accountExists = await _context.Accounts.AnyAsync(a => a.Id == request.AccountId);
        if (!accountExists)
        {
            return BadRequest($"Account {request.AccountId} does not exist.");
        }

        if (request.CategoryId.HasValue)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == request.CategoryId.Value);

            if (!categoryExists)
                return BadRequest($"Category {request.CategoryId} does not exist.");
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            AccountId = request.AccountId,
            CategoryId = request.CategoryId,
            Amount = request.Amount,
            TransactionType = request.TransactionType,
            Description = request.Description,
            Date = request.Date,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    public record CreateTransactionRequest(
        Guid AccountId,
        Guid? CategoryId,
        decimal Amount,
        TransactionType TransactionType,
        DateTime Date,
        string? Description
    );
}
