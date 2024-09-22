import { Knex } from "knex";

declare module "knex/types/tables" {
    interface User {
        id: string;
        name: string;
        email: string;
        created_at: Date;
        session_id?: string;
    }

    interface Meal {
        id: string;
        name: string;
        description: string;
        date: Date;
        is_within_diet: boolean;
        user_id: string;
        created_at: Date;
        updated_at?: Date;
    }

    export interface Tables {
        users: User;
        meals: Meal;
    }
}
