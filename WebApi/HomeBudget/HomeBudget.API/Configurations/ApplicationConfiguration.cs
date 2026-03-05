using FluentValidation;
using HomeBudget.Application.Mappings;

namespace HomeBudget.API.Configurations
{
    public static class ApplicationConfiguration
    {
        public static IServiceCollection AddApplicationConfiguration(
            this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(
                    typeof(MappingConfig).Assembly));

            services.AddValidatorsFromAssembly(
                typeof(MappingConfig).Assembly);

            MappingConfig.RegisterMappings();

            return services;
        }
    }
}