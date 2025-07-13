using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Products;

public static class GetProductById
{
    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("products/{id}", Handler).WithTags("Products");
        }
    }

    public static async Task<IResult> Handler(string id, AppDbContext context)
    {
        var product = await context.Products
            .Include(p => p.ProductCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.ProductSubcategories)
            .ThenInclude(ps => ps.Subcategory)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return Results.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Product not found"
            });

        var response = GetProducts.MapToDto(product);

        return Results.Ok(new ApiResponse<ProductDto> { Data = response });
    }
}