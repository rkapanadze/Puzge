using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data.Entities;

namespace Puzge.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
}