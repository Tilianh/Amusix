using System.Reflection;
using System.Threading.RateLimiting;
using AmusixBackapp.Data;
using AmusixBackapp.Data.Models;
using AmusixBackapp.Shared.Classes;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

#region service registration

builder.Services.AddControllers();

// Rate limiter
builder.Services.AddRateLimiter(options =>
{
    // Each user is limited to 10 requests per minutes per route per method
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: $"{httpContext.User.Identity!.Name}-{httpContext.Request.Host}-{httpContext.Request.IsHttps}",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 10,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// PGSQL database
builder.Services.AddDbContext<AppDbContext>(x =>
{
    var seedDb = builder.Configuration.GetValue<bool>("SeedDatabase");
    x.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
        .UseAsyncSeeding(async (db, _, _) =>
        {
            if (seedDb) await DataSeeder.ExecuteAsync((AppDbContext)db);
        })
        .UseSeeding((db, _) =>
        {
            if (seedDb) DataSeeder.Execute((AppDbContext)db);
        });
});

// Authorization / identity
builder.Services
    .AddAuthorization()
    .AddIdentityApiEndpoints<ApplicationUser>(x =>
    {
        x.User.RequireUniqueEmail = true;
        x.SignIn.RequireConfirmedAccount = false;
        x.SignIn.RequireConfirmedEmail = false;
        x.SignIn.RequireConfirmedPhoneNumber = false;
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultUI();

// Swagger (backend doc. and testing)
builder.Services
    .AddEndpointsApiExplorer()
    .AddSwaggerGen(x =>
    {
        x.AddSecurityDefinition(
            "oauth2",
            new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
        x.OperationFilter<SecurityRequirementsOperationFilter>();
        x.IncludeXmlComments(Path.Combine(
            AppContext.BaseDirectory,
            $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
    });

// Register services
builder.Services.AddScoped<YouTubeApiService>();

#endregion

var app = builder.Build();

#region app configuration

// Ensure DB is up to date
await using (var serviceScope = app.Services.CreateAsyncScope())
await using (var db = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>())
{
    await db.Database.MigrateAsync();
    await db.Database.EnsureCreatedAsync();
}

app.UseCors(options =>
    options.AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins(app.Configuration.GetValue<string>("AllowedOrigins") ?? "*"));
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Global exception handler
app.UseExceptionHandler(exceptionHandlerApp =>
    exceptionHandlerApp.Run(async context => await Results.Problem().ExecuteAsync(context)));

// Development environment configuration
if (app.Environment.IsDevelopment())
{
    // Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI(x =>
    {
        x.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        x.RoutePrefix = "docs";
    });
}

#endregion

app.Run();