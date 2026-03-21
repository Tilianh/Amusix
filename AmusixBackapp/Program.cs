using AmusixBackapp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

#region database config

builder.Services.AddEntityFrameworkNpgsql().AddDbContext<AppDbContext>(x =>
{
    x.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
});

#endregion

#region authorization config

builder.Services.AddAuthorization();
builder.Services
    .AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// Policy / role registration
// builder.Services
//     .AddAuthorizationBuilder()
//     .AddPolicy(Policies.ManageTests, policy => policy.RequireRole(Roles.Admin))
//     .AddPolicy(Policies.ManageTests, policy => policy.RequireRole(Roles.Admin));

#endregion

#region Swagger UI config

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
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
});

#endregion

var app = builder.Build();

#region dev env config

if (app.Environment.IsDevelopment())
{
    // Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI();
}

#endregion

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();