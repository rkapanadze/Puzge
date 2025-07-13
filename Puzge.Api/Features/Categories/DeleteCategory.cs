using Microsoft.EntityFrameworkCore;
using Puzge.Api.Data;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class DeleteCategory
{
    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapDelete("categories/{id}", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(string id, AppDbContext context)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return Results.NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Category not found"
            });

        // Soft delete - just mark as inactive
        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return Results.Ok(new ApiResponse<object>
        {
            Data = new { message = "Category deleted successfully" }
        });
    }
}