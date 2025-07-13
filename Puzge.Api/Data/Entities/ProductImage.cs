using System.ComponentModel.DataAnnotations;

namespace Puzge.Api.Data.Entities;

public class ProductImage
{
    [Key] public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required] public string ProductId { get; set; } = string.Empty;

    [Required] public string ImageUrl { get; set; } = string.Empty;

    public int Order { get; set; } = 0;

    // Navigation properties
    public Product Product { get; set; } = null!;
}