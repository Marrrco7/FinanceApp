using FinanceApp.Domain.Categories;
using Microsoft.EntityFrameworkCore;
using FinanceApp.Domain.Accounts;
using FinanceApp.Domain.Transactions;
namespace FinanceApp.Infrastructure.Persistence;

public class FinanceDbContext(DbContextOptions<FinanceDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Category>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.Property(c => c.CategoryType).IsRequired();
            builder.Property(c => c.Color).HasMaxLength(20);
            builder.Property(c => c.CreatedAt).IsRequired();
        });
        
        modelBuilder.Entity<Account>(builder =>
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Name).IsRequired().HasMaxLength(100);
            builder.Property(a => a.AccountType).IsRequired();
            builder.Property(a => a.InitialBalance).HasColumnType("decimal(18,2)");
            builder.Property(a => a.IsArchived).IsRequired();
        });
        
        modelBuilder.Entity<Transaction>(builder =>
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Amount).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(t => t.TransactionType).IsRequired();
        builder.Property(t => t.Date).IsRequired();
        builder.HasOne<Account>().WithMany().OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<Category>().WithMany().HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    });
        
    }
    
    
}