using FinanceApp.Domain.Transactions;
using FinanceApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(FinanceDbContext context) : ControllerBase
{
    private readonly FinanceDbContext _context = context;

    [HttpGet("summary")]
    public async Task<ActionResult<MonthlySummaryResponse>> GetMonthlySummary(
        [FromQuery] int year,
        [FromQuery] int month)
    {
        if (year <= 0 || month is < 1 or > 12)
            return BadRequest("Invalid year or month.");

        var from = new DateTime(year, month, 1);
        var to = from.AddMonths(1);

        var transactionsQuery = _context.Transactions
            .Where(t => t.Date >= from && t.Date < to);

        var totalIncome = await transactionsQuery
            .Where(t => t.TransactionType == TransactionType.Income)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var totalExpenses = await transactionsQuery
            .Where(t => t.TransactionType == TransactionType.Expense)
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var net = totalIncome - totalExpenses;

        var perCategoryExpenses = await transactionsQuery
            .Where(t => t.TransactionType == TransactionType.Expense)
            .GroupBy(t => t.CategoryId)
            .Select(g => new
            {
                CategoryId = g.Key,
                Total = g.Sum(t => t.Amount)
            })
            .ToListAsync();

        var categoryIds = perCategoryExpenses
            .Where(x => x.CategoryId.HasValue)
            .Select(x => x.CategoryId!.Value)
            .ToList();

        var categories = await _context.Categories
            .Where(c => categoryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c.Name);

        var categorySummaries = perCategoryExpenses.Select(x =>
            new CategorySummary(
                x.CategoryId,
                x.CategoryId.HasValue && categories.TryGetValue(x.CategoryId.Value, out var name)
                    ? name
                    : "Uncategorized",
                x.Total
            )).ToList();

        var response = new MonthlySummaryResponse(
            year,
            month,
            totalIncome,
            totalExpenses,
            net,
            categorySummaries
        );

        return Ok(response);
    }

    // DTOs

    public record CategorySummary(
        Guid? CategoryId,
        string CategoryName,
        decimal TotalExpenses
    );

    public record MonthlySummaryResponse(
        int Year,
        int Month,
        decimal TotalIncome,
        decimal TotalExpenses,
        decimal Net,
        List<CategorySummary> Categories
    );
}
