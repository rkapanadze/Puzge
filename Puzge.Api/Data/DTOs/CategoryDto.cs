using Puzge.Api.Data.Models;

namespace Puzge.Api.Data.DTOs;

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;
    public LocalizedString Name { get; set; } = new();
    public LocalizedString Description { get; set; } = new();
    public string? Image { get; set; }
    public List<SubcategoryDto> Subcategories { get; set; } = new();
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}