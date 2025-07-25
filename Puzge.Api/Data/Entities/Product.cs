using System.ComponentModel.DataAnnotations;
using Puzge.Api.Data.Enums;

namespace Puzge.Api.Data.Entities;

public class Product
{
    [Key] public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required] public string NameEn { get; set; } = string.Empty;

    [Required] public string NameKa { get; set; } = string.Empty;

    public string DescriptionEn { get; set; } = string.Empty;
    public string DescriptionKa { get; set; } = string.Empty;

    public ProductType Type { get; set; }

    public decimal? Price { get; set; }
    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Specifications
    public string? Dimensions { get; set; }
    public string? Weight { get; set; }
    public string? Material { get; set; }
    public string? AgeRange { get; set; }
    public string? PlayerCount { get; set; }
    public string? PlayTime { get; set; }
    public string? Difficulty { get; set; }

    // Navigation properties
    public List<ProductCategory> ProductCategories { get; set; } = new();
    public List<ProductSubcategory> ProductSubcategories { get; set; } = new();
    public List<ProductImage> ProductImages { get; set; } = new();
}