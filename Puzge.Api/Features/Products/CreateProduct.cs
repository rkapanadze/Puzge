using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Entities;
using Puzge.Api.Data.Enums;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Products;

public static class CreateProduct
{
    public record CreateProductRequest(
        LocalizedString Name,
        LocalizedString Description,
        ProductType Type,
        List<string> CategoryIds,
        List<string> SubcategoryIds,
        List<string> Images,
        decimal? Price = null,
        bool IsAvailable = true,
        ProductSpecifications? Specifications = null
    );

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("products", Handler).WithTags("Products");
        }
    }

    public static async Task<IResult> Handler(CreateProductRequest request, AppDbContext context)
    {
        // Validate categories exist
        var categories = await context.Categories
            .Where(c => request.CategoryIds.Contains(c.Id))
            .ToListAsync();

        if (categories.Count != request.CategoryIds.Count)
            return Results.BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "One or more categories not found"
            });

        // Validate subcategories exist
        var subcategories = await context.Subcategories
            .Where(s => request.SubcategoryIds.Contains(s.Id))
            .ToListAsync();

        if (subcategories.Count != request.SubcategoryIds.Count)
            return Results.BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "One or more subcategories not found"
            });

        var product = new Product
        {
            NameEn = request.Name.En,
            NameKa = request.Name.Ka,
            DescriptionEn = request.Description.En,
            DescriptionKa = request.Description.Ka,
            Type = request.Type,
            Price = request.Price,
            IsAvailable = request.IsAvailable,
            Dimensions = request.Specifications?.Dimensions,
            Weight = request.Specifications?.Weight,
            Material = request.Specifications?.Material,
            AgeRange = request.Specifications?.AgeRange,
            PlayerCount = request.Specifications?.PlayerCount,
            PlayTime = request.Specifications?.PlayTime,
            Difficulty = request.Specifications?.Difficulty
        };

        await context.Products.AddAsync(product);

        // Add category relationships
        foreach (var categoryId in request.CategoryIds)
        {
            await context.ProductCategories.AddAsync(new ProductCategory
            {
                ProductId = product.Id,
                CategoryId = categoryId
            });
        }

        // Add subcategory relationships
        foreach (var subcategoryId in request.SubcategoryIds)
        {
            await context.ProductSubcategories.AddAsync(new ProductSubcategory
            {
                ProductId = product.Id,
                SubcategoryId = subcategoryId
            });
        }

        // Add images
        for (int i = 0; i < request.Images.Count; i++)
        {
            await context.ProductImages.AddAsync(new ProductImage
            {
                ProductId = product.Id,
                ImageUrl = request.Images[i],
                Order = i
            });
        }

        await context.SaveChangesAsync();

        // Load the complete product for response
        var createdProduct = await context.Products
            .Include(p => p.ProductCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.ProductSubcategories)
            .ThenInclude(ps => ps.Subcategory)
            .Include(p => p.ProductImages)
            .FirstAsync(p => p.Id == product.Id);

        var response = GetProducts.MapToDto(createdProduct);

        return Results.Ok(new ApiResponse<ProductDto> { Data = response });
    }
}