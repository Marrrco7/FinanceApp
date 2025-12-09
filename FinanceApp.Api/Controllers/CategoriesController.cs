using FinanceApp.Domain.Categories;
using FinanceApp.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(FinanceDbContext context) : ControllerBase
{
    private readonly FinanceDbContext _context = context;
    
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetAll()
    {
        var categories = await _context.Categories
            .OrderBy(c=>c.Name)
            .ToListAsync();
        return Ok(categories);
    }
    
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Category>> GetById(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if(category == null) return NotFound();
        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CategoryType = request.CategoryType,
            Color = request.Color,
            IsArchived = false,
            CreatedAt = DateTime.UtcNow
        };
        
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new {id = category.Id}, category);
    }
    
    public record CreateCategoryRequest(string Name, CategoryType CategoryType, string? Color);

    
}