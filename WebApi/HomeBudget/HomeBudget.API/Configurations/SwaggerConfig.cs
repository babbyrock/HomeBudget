using Microsoft.OpenApi;

namespace HomeBudget.API.Configurations
{
    public static class SwaggerConfig
    {
        public static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.EnableAnnotations();
                c.SchemaFilter<EnumSchemaFilter>();
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "HomeBudget API",
                    Version = "v1"
                });
            });

            return services;
        }

        public static IApplicationBuilder UseSwaggerConfiguration(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "HomeBudget API v1");
                c.RoutePrefix = string.Empty;
            });

            return app;
        }
    }
}