using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeBudget.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AjusteEnums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "valor",
                table: "Transacao",
                newName: "Valor");

            migrationBuilder.RenameColumn(
                name: "tipo",
                table: "Transacao",
                newName: "Tipo");

            migrationBuilder.RenameColumn(
                name: "descricao",
                table: "Transacao",
                newName: "Descricao");

            migrationBuilder.RenameColumn(
                name: "nome",
                table: "Pessoa",
                newName: "Nome");

            migrationBuilder.RenameColumn(
                name: "idade",
                table: "Pessoa",
                newName: "Idade");

            migrationBuilder.RenameColumn(
                name: "finalidade",
                table: "Categoria",
                newName: "Finalidade");

            migrationBuilder.RenameColumn(
                name: "descricao",
                table: "Categoria",
                newName: "Descricao");

            migrationBuilder.AlterColumn<string>(
                name: "Tipo",
                table: "Transacao",
                type: "VARCHAR(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)");

            migrationBuilder.AlterColumn<string>(
                name: "Finalidade",
                table: "Categoria",
                type: "VARCHAR(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(20)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Valor",
                table: "Transacao",
                newName: "valor");

            migrationBuilder.RenameColumn(
                name: "Tipo",
                table: "Transacao",
                newName: "tipo");

            migrationBuilder.RenameColumn(
                name: "Descricao",
                table: "Transacao",
                newName: "descricao");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Pessoa",
                newName: "nome");

            migrationBuilder.RenameColumn(
                name: "Idade",
                table: "Pessoa",
                newName: "idade");

            migrationBuilder.RenameColumn(
                name: "Finalidade",
                table: "Categoria",
                newName: "finalidade");

            migrationBuilder.RenameColumn(
                name: "Descricao",
                table: "Categoria",
                newName: "descricao");

            migrationBuilder.AlterColumn<string>(
                name: "tipo",
                table: "Transacao",
                type: "varchar(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)");

            migrationBuilder.AlterColumn<string>(
                name: "finalidade",
                table: "Categoria",
                type: "NVARCHAR(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "VARCHAR(20)");
        }
    }
}
