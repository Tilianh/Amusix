using AmusixBackapp.Shared;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmusixBackapp.Data.Migrations
{
    /// <inheritdoc />
    public partial class InsertRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add roles
            migrationBuilder.InsertData(
                table:"AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new [,]
                {
                    { Guid.NewGuid().ToString(), Guid.NewGuid().ToString(), AppRoles.User, AppRoles.User.Normalize().ToUpper() },
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Name",
                keyValues: new[] { AppRoles.User });
        }
    }
}
