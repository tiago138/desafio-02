import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/create-user", async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string(),
        });

        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomUUID();

            reply.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        const { name, email } = createUserBodySchema.parse(request.body);

        const user = await knex("users").where({ email }).first();

        if (user) {
            return reply.status(404).send({
                error: "User already exists",
            });
        }

        await knex("users").insert({
            id: randomUUID(),
            email,
            name,
            session_id: sessionId,
        });

        return reply.status(201).send();
    });
}
