using HomeBudget.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace HomeBudget.API.Configurations
{
    public static class MigrationConfig
    {
        public static IServiceCollection AddMigrationConfiguration(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    connectionString,
                    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

            return services;
        }

        public static IApplicationBuilder UseMigrationConfiguration(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            dbContext.Database.Migrate();

            return app;
        }
    }
}
