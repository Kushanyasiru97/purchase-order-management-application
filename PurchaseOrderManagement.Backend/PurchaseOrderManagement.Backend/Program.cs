using Microsoft.EntityFrameworkCore;
using PurchaseOrderManagement.Application.Interfaces.Repositories;
using PurchaseOrderManagement.Application.Interfaces.Services;
using PurchaseOrderManagement.Application.Services;
using PurchaseOrderManagement.Infrastructure.Data;
using PurchaseOrderManagement.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();


// Configure Database 
builder.Services.AddDbContext<PurchaseOrderDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("PurchaseOrdersConn"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    )
);

// Register Repositories (Infrastructure Layer)
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();

// Register Services (Application Layer)
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();


app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();