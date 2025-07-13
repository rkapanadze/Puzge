using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Entities;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class CreateSubcategory
{
    public record CreateSubcategoryRequest(
        LocalizedString Name,
        LocalizedString Description,
        string CategoryId,
        string? Image = null,
        bool IsActive = true
    );

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("subcategories", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(CreateSubcategoryRequest request, AppDbContext context)
    {
        // Validate category exists
        var category = await context.Categories.FindAsync(request.CategoryId);
        if (category == null)
            return Results.BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Category not found"
            });

        var subcategory = new Subcategory
        {
            NameEn = request.Name.En,
            NameKa = request.Name.Ka,
            DescriptionEn = request.Description.En,
            DescriptionKa = request.Description.Ka,
            CategoryId = request.CategoryId,
            Image = request.Image,
            IsActive = request.IsActive
        };

        await context.Subcategories.AddAsync(subcategory);
        await context.SaveChangesAsync();

        var response = new SubcategoryDto
        {
            Id = subcategory.Id,
            Name = new LocalizedString { En = subcategory.NameEn, Ka = subcategory.NameKa },
            Description = new LocalizedString { En = subcategory.DescriptionEn, Ka = subcategory.DescriptionKa },
            CategoryId = subcategory.CategoryId,
            Image = subcategory.Image,
            IsActive = subcategory.IsActive,
            CreatedAt = subcategory.CreatedAt,
            UpdatedAt = subcategory.UpdatedAt
        };

        return Results.Ok(new ApiResponse<SubcategoryDto> { Data = response });
    }
} 