using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class GetCategoryById
{
    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapGet("categories/{id}", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(string id, AppDbContext context)
    {
        var category = await context.Categories
            .Include(c => c.Subcategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return Results.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Category not found"
            });

        var response = GetCategories.MapToDto(category);

        return Results.Ok(new ApiResponse<CategoryDto> { Data = response });
    }
}