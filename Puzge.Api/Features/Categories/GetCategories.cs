using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Entities;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class GetCategories
{
    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("categories", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(AppDbContext context)
    {
        var categories = await context.Categories
            .Include(c => c.Subcategories)
            .Where(c => c.IsActive)
            .ToListAsync();

        var response = categories.Select(MapToDto).ToList();

        return Results.Ok(new ApiResponse<List<CategoryDto>> { Data = response });
    }

    public static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = new LocalizedString { En = category.NameEn, Ka = category.NameKa },
            Description = new LocalizedString { En = category.DescriptionEn, Ka = category.DescriptionKa },
            Image = category.Image,
            IsActive = category.IsActive,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt,
            Subcategories = category.Subcategories
                .Where(s => s.IsActive)
                .Select(s => new SubcategoryDto
                {
                    Id = s.Id,
                    Name = new LocalizedString { En = s.NameEn, Ka = s.NameKa },
                    Description = new LocalizedString { En = s.DescriptionEn, Ka = s.DescriptionKa },
                    CategoryId = s.CategoryId,
                    Image = s.Image,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                }).ToList()
        };
    }
}