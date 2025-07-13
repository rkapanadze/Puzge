using Puzge.Api.Data;
using Puzge.Api.Data.DTOs;
using Puzge.Api.Data.Entities;
using Puzge.Api.Data.Models;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Features.Categories;

public static class CreateCategory
{
    public record CreateCategoryRequest(
        LocalizedString Name,
        LocalizedString Description,
        string? Image = null,
        bool IsActive = true
    );

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("categories", Handler).WithTags("Categories");
        }
    }

    public static async Task<IResult> Handler(CreateCategoryRequest request, AppDbContext context)
    {
        var category = new Category
        {
            NameEn = request.Name.En,
            NameKa = request.Name.Ka,
            DescriptionEn = request.Description.En,
            DescriptionKa = request.Description.Ka,
            Image = request.Image,
            IsActive = request.IsActive
        };

        await context.Categories.AddAsync(category);
        await context.SaveChangesAsync();

        var response = GetCategories.MapToDto(category);

        return Results.Ok(new ApiResponse<CategoryDto> { Data = response });
    }
}