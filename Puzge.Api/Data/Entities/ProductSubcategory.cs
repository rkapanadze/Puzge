using System.ComponentModel.DataAnnotations;

namespace Puzge.Api.Data.Entities;

public class ProductSubcategory
{
    [Required] public string ProductId { get; set; } = string.Empty;

    [Required] public string SubcategoryId { get; set; } = string.Empty;

    // Navigation properties
    public Product Product { get; set; } = null!;
    public Subcategory Subcategory { get; set; } = null!;
}