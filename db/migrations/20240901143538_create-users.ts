import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid("id").primary();
        table.uuid("session_id").unique().index();
        table.text("name").notNullable();
        table.text("email").notNullable().unique().index();
        table.date("created_at").defaultTo(knex.fn.now()).notNullable();
    });

    await knex.schema.createTable("meals", (table) => {
        table.uuid("id").primary();
        table.text("name").notNullable();
        table.text("description").notNullable();
        table.date("date").notNullable();
        table.boolean("is_within_diet").notNullable();
        table.uuid("user_id").notNullable().index();
        table.date("created_at").defaultTo(knex.fn.now()).notNullable();
        table.date("updated_at");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
    await knex.schema.dropTable("meals");
}
