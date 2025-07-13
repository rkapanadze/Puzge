using Puzge.Api.Data.Models;

namespace Puzge.Api.Data.DTOs;

public class SubcategoryDto
{
    public string Id { get; set; } = string.Empty;
    public LocalizedString Name { get; set; } = new();
    public LocalizedString Description { get; set; } = new();
    public string CategoryId { get; set; } = string.Empty;
    public string? Image { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}