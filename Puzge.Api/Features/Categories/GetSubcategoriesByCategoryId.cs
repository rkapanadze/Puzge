using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class GetSubcategoriesByCategoryId
{
    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("categories/{categoryId}/subcategories", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(string categoryId, AppDbContext context)
    {
        var categoryExists = await context.Categories
            .AnyAsync(c => c.Id == categoryId && c.IsActive);

        if (!categoryExists)
            return Results.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Category not found"
            });

        var subcategories = await context.Subcategories
            .Where(s => s.CategoryId == categoryId && s.IsActive)
            .ToListAsync();

        var response = subcategories.Select(s => new SubcategoryDto
        {
            Id = s.Id,
            Name = new LocalizedString { En = s.NameEn, Ka = s.NameKa },
            Description = new LocalizedString { En = s.DescriptionEn, Ka = s.DescriptionKa },
            CategoryId = s.CategoryId,
            Image = s.Image,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        }).ToList();

        return Results.Ok(new ApiResponse<List<SubcategoryDto>> { Data = response });
    }
}