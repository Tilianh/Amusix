using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AmusixBackapp.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext(options)
{
    #region database sets
    
    // TODO: define DBSets here
    
    #endregion
}