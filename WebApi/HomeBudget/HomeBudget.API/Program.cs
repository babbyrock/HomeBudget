using HomeBudget.API.Configurations;
using HomeBudget.Domain.Interfaces;
using HomeBudget.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMigrationConfiguration(builder.Configuration);
builder.Services.AddSwaggerConfiguration();
builder.Services.AddApplicationConfiguration();
builder.Services.AddCorsConfiguration();

builder.Services.AddControllers();

builder.Services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();

var app = builder.Build();

app.UseMigrationConfiguration();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerConfiguration();
}

app.UseHttpsRedirection();
app.UseCorsConfiguration();
app.UseAuthorization();
app.MapControllers();

app.Run();