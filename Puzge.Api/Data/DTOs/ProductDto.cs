using Puzge.Api.Data.Enums;
using Puzge.Api.Data.Models;

namespace Puzge.Api.Data.DTOs;

public class ProductDto
{
    public string Id { get; set; } = string.Empty;
    public LocalizedString Name { get; set; } = new();
    public LocalizedString Description { get; set; } = new();
    public ProductType Type { get; set; }
    public List<CategoryDto> Categories { get; set; } = new();
    public List<SubcategoryDto> Subcategories { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public decimal? Price { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ProductSpecifications? Specifications { get; set; }
}