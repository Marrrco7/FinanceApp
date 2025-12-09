namespace FinanceApp.Domain.Categories;

public enum CategoryType
{
    Expense = 0,
    Income = 1
}

public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CategoryType CategoryType { get; set; } = CategoryType.Expense;
    public string? Color { get; set; }
    public bool IsArchived { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
}