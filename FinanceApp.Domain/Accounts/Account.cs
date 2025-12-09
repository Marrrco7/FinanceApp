namespace FinanceApp.Domain.Accounts;

public enum AccountType
{
    Cash = 0,
    Bank = 1,
    CreditCard = 2,
    Savings = 3,
    Investment = 4
}

public class Account
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public AccountType AccountType { get; set; } = AccountType.Bank;

    public decimal InitialBalance { get; set; }

    public bool IsArchived { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}