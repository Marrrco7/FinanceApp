namespace FinanceApp.Domain.Transactions;

public enum TransactionType
{
    Expense = 0,
    Income = 1,
    Transfer = 2
}

public class Transaction
{
    public Guid Id { get; set; }

    public Guid AccountId { get; set; }
    
    public Guid? CategoryId { get; set; } 

    public decimal Amount { get; set; }

    public TransactionType TransactionType { get; set; } = TransactionType.Expense;

    public string? Description { get; set; }

    public DateTime Date { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}