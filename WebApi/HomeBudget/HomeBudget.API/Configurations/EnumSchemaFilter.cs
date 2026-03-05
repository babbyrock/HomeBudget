using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace HomeBudget.API.Configurations
{
    public class EnumSchemaFilter : ISchemaFilter
    {
        public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
        {
            if (!context.Type.IsEnum) return;

            schema.Description = string.Join(" | ", Enum.GetValues(context.Type)
                .Cast<Enum>()
                .Select(e => $"{Convert.ToInt32(e)} = {e}"));
        }
    }
}