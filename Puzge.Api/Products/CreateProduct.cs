using Puzge.Api.Data;
using Puzge.Api.Data.Entities;
using Puzge.Api.Endpoints;

namespace Puzge.Api.Products;

public static class CreateProduct
{
    public record Request(string Name, decimal Price);

    public record Response(int Id, string Name, decimal Price);

    public sealed class Endpoint : IEndpoint
    {
        public void MapEndpoint(IEndpointRouteBuilder app)
        {
            app.MapPost("products", Handler).WithTags("Products");
        }
    }

    public async static Task<IResult> Handler(Request request, AppDbContext context)
    {
        var product = new Product { Name = request.Name, Price = request.Price };
        await context.Products.AddAsync(product);
        await context.SaveChangesAsync();
        return Results.Ok(new Response(product.Id, product.Name, product.Price));
    }
}