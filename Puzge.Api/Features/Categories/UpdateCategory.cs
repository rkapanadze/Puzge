using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class UpdateCategory
{
    public record UpdateCategoryRequest(
        LocalizedString Name,
        LocalizedString Description,
        string? Image = null,
        bool IsActive = true
    );

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPut("categories/{id}", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(string id, UpdateCategoryRequest request, AppDbContext context)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return Results.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Category not found"
            });

        category.NameEn = request.Name.En;
        category.NameKa = request.Name.Ka;
        category.DescriptionEn = request.Description.En;
        category.DescriptionKa = request.Description.Ka;
        category.Image = request.Image;
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        var response = GetCategories.MapToDto(category);

        return Results.Ok(new ApiResponse<CategoryDto> { Data = response });
    }
}