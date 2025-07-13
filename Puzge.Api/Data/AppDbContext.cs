using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data.Entities;

namespace Puzge.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductSubcategory> ProductSubcategories => Set<ProductSubcategory>();
    public DbSet<Subcategory> Subcategories => Set<Subcategory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ProductCategory: composite key and relationships
        modelBuilder.Entity<ProductCategory>()
            .HasKey(pc => new { pc.ProductId, pc.CategoryId });

        modelBuilder.Entity<ProductCategory>()
            .HasOne(pc => pc.Product)
            .WithMany(p => p.ProductCategories)
            .HasForeignKey(pc => pc.ProductId);

        modelBuilder.Entity<ProductCategory>()
            .HasOne(pc => pc.Category)
            .WithMany(c => c.ProductCategories)
            .HasForeignKey(pc => pc.CategoryId);

        // ProductSubcategory: composite key and relationships
        modelBuilder.Entity<ProductSubcategory>()
            .HasKey(ps => new { ps.ProductId, ps.SubcategoryId });

        modelBuilder.Entity<ProductSubcategory>()
            .HasOne(ps => ps.Product)
            .WithMany(p => p.ProductSubcategories)
            .HasForeignKey(ps => ps.ProductId);

        modelBuilder.Entity<ProductSubcategory>()
            .HasOne(ps => ps.Subcategory)
            .WithMany(s => s.ProductSubcategories)
            .HasForeignKey(ps => ps.SubcategoryId);

        // Category-Subcategory: one-to-many
        modelBuilder.Entity<Subcategory>()
            .HasOne(s => s.Category)
            .WithMany(c => c.Subcategories)
            .HasForeignKey(s => s.CategoryId);

        // Product-ProductImage: one-to-many
        modelBuilder.Entity<ProductImage>()
            .HasOne(pi => pi.Product)
            .WithMany(p => p.ProductImages)
            .HasForeignKey(pi => pi.ProductId);
    }
}