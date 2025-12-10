using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PurchaseOrderManagement.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangePoNumberToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PoNumber",
                table: "PurchaseOrders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "PoNumber",
                table: "PurchaseOrders",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
