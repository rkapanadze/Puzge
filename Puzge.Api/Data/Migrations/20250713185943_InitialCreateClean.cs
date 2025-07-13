using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Puzge.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateClean : Migration
    {
        /// <inheritdoc />
       protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.CreateTable(
        name: "Products",
        columns: table => new
        {
            Id = table.Column<string>(type: "text", nullable: false),
            NameEn = table.Column<string>(type: "text", nullable: false),
            NameKa = table.Column<string>(type: "text", nullable: false),
            DescriptionEn = table.Column<string>(type: "text", nullable: false),
            DescriptionKa = table.Column<string>(type: "text", nullable: false),
            Price = table.Column<decimal>(type: "numeric", nullable: true),
            AgeRange = table.Column<string>(type: "text", nullable: true),
            Difficulty = table.Column<string>(type: "text", nullable: true),
            Dimensions = table.Column<string>(type: "text", nullable: true),
            Material = table.Column<string>(type: "text", nullable: true),
            Weight = table.Column<string>(type: "text", nullable: true),
            PlayerCount = table.Column<string>(type: "text", nullable: true),
            PlayTime = table.Column<string>(type: "text", nullable: true),
            Type = table.Column<int>(type: "integer", nullable: false),
            IsAvailable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Products", x => x.Id);
        });

    migrationBuilder.CreateTable(
        name: "Categories",
        columns: table => new
        {
            Id = table.Column<string>(type: "text", nullable: false),
            NameEn = table.Column<string>(type: "text", nullable: false),
            NameKa = table.Column<string>(type: "text", nullable: false),
            DescriptionEn = table.Column<string>(type: "text", nullable: false),
            DescriptionKa = table.Column<string>(type: "text", nullable: false),
            Image = table.Column<string>(type: "text", nullable: true),
            IsActive = table.Column<bool>(type: "boolean", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Categories", x => x.Id);
        });

    migrationBuilder.CreateTable(
        name: "ProductImages",
        columns: table => new
        {
            Id = table.Column<string>(type: "text", nullable: false),
            ProductId = table.Column<string>(type: "text", nullable: false),
            ImageUrl = table.Column<string>(type: "text", nullable: false),
            Order = table.Column<int>(type: "integer", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_ProductImages", x => x.Id);
            table.ForeignKey(
                name: "FK_ProductImages_Products_ProductId",
                column: x => x.ProductId,
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        });

    migrationBuilder.CreateTable(
        name: "ProductCategories",
        columns: table => new
        {
            ProductId = table.Column<string>(type: "text", nullable: false),
            CategoryId = table.Column<string>(type: "text", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_ProductCategories", x => new { x.ProductId, x.CategoryId });
            table.ForeignKey(
                name: "FK_ProductCategories_Products_ProductId",
                column: x => x.ProductId,
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            table.ForeignKey(
                name: "FK_ProductCategories_Categories_CategoryId",
                column: x => x.CategoryId,
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        });

    migrationBuilder.CreateTable(
        name: "Subcategories",
        columns: table => new
        {
            Id = table.Column<string>(type: "text", nullable: false),
            NameEn = table.Column<string>(type: "text", nullable: false),
            NameKa = table.Column<string>(type: "text", nullable: false),
            DescriptionEn = table.Column<string>(type: "text", nullable: false),
            DescriptionKa = table.Column<string>(type: "text", nullable: false),
            CategoryId = table.Column<string>(type: "text", nullable: false),
            Image = table.Column<string>(type: "text", nullable: true),
            IsActive = table.Column<bool>(type: "boolean", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Subcategories", x => x.Id);
            table.ForeignKey(
                name: "FK_Subcategories_Categories_CategoryId",
                column: x => x.CategoryId,
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        });

    migrationBuilder.CreateTable(
        name: "ProductSubcategories",
        columns: table => new
        {
            ProductId = table.Column<string>(type: "text", nullable: false),
            SubcategoryId = table.Column<string>(type: "text", nullable: false)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_ProductSubcategories", x => new { x.ProductId, x.SubcategoryId });
            table.ForeignKey(
                name: "FK_ProductSubcategories_Products_ProductId",
                column: x => x.ProductId,
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            table.ForeignKey(
                name: "FK_ProductSubcategories_Subcategories_SubcategoryId",
                column: x => x.SubcategoryId,
                principalTable: "Subcategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        });

    // Indexes
    migrationBuilder.CreateIndex(
        name: "IX_ProductCategories_CategoryId",
        table: "ProductCategories",
        column: "CategoryId");

    migrationBuilder.CreateIndex(
        name: "IX_ProductImages_ProductId",
        table: "ProductImages",
        column: "ProductId");

    migrationBuilder.CreateIndex(
        name: "IX_ProductSubcategories_SubcategoryId",
        table: "ProductSubcategories",
        column: "SubcategoryId");

    migrationBuilder.CreateIndex(
        name: "IX_Subcategories_CategoryId",
        table: "Subcategories",
        column: "CategoryId");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropTable(name: "ProductCategories");
    migrationBuilder.DropTable(name: "ProductImages");
    migrationBuilder.DropTable(name: "ProductSubcategories");
    migrationBuilder.DropTable(name: "Subcategories");
    migrationBuilder.DropTable(name: "Products");
    migrationBuilder.DropTable(name: "Categories");
}
    }
}
