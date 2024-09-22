import { knex } from "../database";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
    const sessionId = request.cookies.sessionId;
    const user = await knex("users").where({ session_id: sessionId }).first();

    if (!user) {
        return reply.status(404).send({
            error: "User not found.",
        });
    }

    return { user };
}
