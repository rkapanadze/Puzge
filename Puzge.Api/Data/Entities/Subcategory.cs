using System.ComponentModel.DataAnnotations;

namespace Puzge.Api.Data.Entities;

public class Subcategory
{
    [Key] public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required] public string NameEn { get; set; } = string.Empty;

    [Required] public string NameKa { get; set; } = string.Empty;

    public string DescriptionEn { get; set; } = string.Empty;
    public string DescriptionKa { get; set; } = string.Empty;

    [Required] public string CategoryId { get; set; } = string.Empty;

    public string? Image { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Category Category { get; set; } = null!;
    public List<ProductSubcategory> ProductSubcategories { get; set; } = new();
}