using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Entities;
using Puzge.Api.Data.Enums;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Products;

public static class GetProducts
{
    public record GetProductsRequest(
        ProductType? Type = null,
        string? CategoryIds = null,
        string? SubcategoryIds = null,
        string? Search = null,
        int? Limit = null,
        int? Offset = null
    );

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("products", Handler).WithTags("Products");
        }
    }

    public static async Task<IResult> Handler([AsParameters] GetProductsRequest request, AppDbContext context)
    {
        var query = context.Products
            .Include(p => p.ProductCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.ProductSubcategories)
            .ThenInclude(ps => ps.Subcategory)
            .Include(p => p.ProductImages)
            .AsQueryable();

        // Apply filters
        if (request.Type.HasValue)
            query = query.Where(p => p.Type == request.Type.Value);

        if (!string.IsNullOrEmpty(request.CategoryIds))
        {
            var categoryIds = request.CategoryIds.Split(',').ToArray();
            query = query.Where(p => p.ProductCategories.Any(pc => categoryIds.Contains(pc.CategoryId)));
        }

        if (!string.IsNullOrEmpty(request.SubcategoryIds))
        {
            var subcategoryIds = request.SubcategoryIds.Split(',').ToArray();
            query = query.Where(p => p.ProductSubcategories.Any(ps => subcategoryIds.Contains(ps.SubcategoryId)));
        }

        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(p => p.NameEn.Contains(request.Search) ||
                                     p.NameKa.Contains(request.Search) ||
                                     p.DescriptionEn.Contains(request.Search) ||
                                     p.DescriptionKa.Contains(request.Search));
        }

        // Apply pagination
        if (request.Offset.HasValue)
            query = query.Skip(request.Offset.Value);

        if (request.Limit.HasValue)
            query = query.Take(request.Limit.Value);

        var products = await query.ToListAsync();

        var response = products.Select(MapToDto).ToList();

        return Results.Ok(new ApiResponse<List<ProductDto>> { Data = response });
    }

    public static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = new LocalizedString { En = product.NameEn, Ka = product.NameKa },
            Description = new LocalizedString { En = product.DescriptionEn, Ka = product.DescriptionKa },
            Type = product.Type,
            Categories = product.ProductCategories.Select(pc => new CategoryDto
            {
                Id = pc.Category.Id,
                Name = new LocalizedString { En = pc.Category.NameEn, Ka = pc.Category.NameKa },
                Description = new LocalizedString { En = pc.Category.DescriptionEn, Ka = pc.Category.DescriptionKa },
                Image = pc.Category.Image,
                IsActive = pc.Category.IsActive,
                CreatedAt = pc.Category.CreatedAt,
                UpdatedAt = pc.Category.UpdatedAt
            }).ToList(),
            Subcategories = product.ProductSubcategories.Select(ps => new SubcategoryDto
            {
                Id = ps.Subcategory.Id,
                Name = new LocalizedString { En = ps.Subcategory.NameEn, Ka = ps.Subcategory.NameKa },
                Description = new LocalizedString
                    { En = ps.Subcategory.DescriptionEn, Ka = ps.Subcategory.DescriptionKa },
                CategoryId = ps.Subcategory.CategoryId,
                Image = ps.Subcategory.Image,
                IsActive = ps.Subcategory.IsActive,
                CreatedAt = ps.Subcategory.CreatedAt,
                UpdatedAt = ps.Subcategory.UpdatedAt
            }).ToList(),
            Images = product.ProductImages.OrderBy(pi => pi.Order).Select(pi => pi.ImageUrl).ToList(),
            Price = product.Price,
            IsAvailable = product.IsAvailable,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            Specifications = new ProductSpecifications
            {
                Dimensions = product.Dimensions,
                Weight = product.Weight,
                Material = product.Material,
                AgeRange = product.AgeRange,
                PlayerCount = product.PlayerCount,
                PlayTime = product.PlayTime,
                Difficulty = product.Difficulty
            }
        };
    }
}