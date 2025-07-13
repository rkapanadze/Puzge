using System.ComponentModel.DataAnnotations;

namespace Puzge.Api.Data.Entities;

public class ProductCategory
{
    [Required] public string ProductId { get; set; } = string.Empty;

    [Required] public string CategoryId { get; set; } = string.Empty;

    // Navigation properties
    public Product Product { get; set; } = null!;
    public Category Category { get; set; } = null!;
}