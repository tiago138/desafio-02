import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { getUser } from "../utils/get-user";

export async function mealsRoutes(app: FastifyInstance) {
    app.post(
        "/",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const createMealBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                date: z.coerce.date(),
                isWithinDiet: z.boolean(),
            });

            const { isWithinDiet, description, name, date } =
                createMealBodySchema.parse(request.body);

            const { user } = await getUser(request, reply);

            await knex("meals").insert({
                id: randomUUID(),
                date,
                name,
                description,
                is_within_diet: isWithinDiet,
                user_id: user.id,
            });

            return reply.status(201).send();
        },
    );

    app.get(
        "/",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { user } = await getUser(request, reply);

            const meals = await knex("meals")
                .where("user_id", user.id)
                .orderBy("date", "desc")
                .select();

            return { meals };
        },
    );

    app.get(
        "/:id",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { user } = await getUser(request, reply);

            const getMealParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = getMealParamsSchema.parse(request.params);

            const meal = await knex("meals")
                .where({ id, user_id: user.id })
                .first();

            return { meal };
        },
    );

    app.put(
        "/:id",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { user } = await getUser(request, reply);

            const getMealParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = getMealParamsSchema.parse(request.params);

            const editMealBodySchema = z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                date: z.coerce.date().optional(),
                isWithinDiet: z.boolean().optional(),
            });

            const { isWithinDiet, date, description, name } =
                editMealBodySchema.parse(request.body);

            await knex("meals").where({ id, user_id: user.id }).first().update({
                name,
                description,
                date,
                is_within_diet: isWithinDiet,
                updated_at: knex.fn.now(),
            });

            return reply.status(201).send();
        },
    );

    app.delete(
        "/:id",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { user } = await getUser(request, reply);

            const getMealParamsSchema = z.object({
                id: z.string().uuid(),
            });

            const { id } = getMealParamsSchema.parse(request.params);

            await knex("meals")
                .where({ id, user_id: user.id })
                .first()
                .delete();

            return reply.status(201).send();
        },
    );

    app.get(
        "/summary",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { user } = await getUser(request, reply);

            const meals = await knex("meals")
                .where({ user_id: user.id })
                .orderBy("date", "asc")
                .select();

            const mealsAmount = meals.length;

            let mealsWithinTheDietAmount = 0;
            let mealsOutsideTheDietAmount = 0;
            let bestMealSequenceCounter = 0;
            let bestMealSequenceAmount = 0;
            for (const meal of meals) {
                if (meal.is_within_diet) {
                    mealsWithinTheDietAmount++;
                    bestMealSequenceCounter++;

                    if (bestMealSequenceCounter > bestMealSequenceAmount) {
                        bestMealSequenceAmount = bestMealSequenceCounter;
                    }

                    continue;
                }

                mealsOutsideTheDietAmount++;
                if (bestMealSequenceCounter > bestMealSequenceAmount) {
                    bestMealSequenceAmount = bestMealSequenceCounter;
                }
                bestMealSequenceCounter = 0;
            }

            return {
                mealsAmount,
                mealsWithinTheDietAmount,
                mealsOutsideTheDietAmount,
                bestMealSequenceAmount,
            };
        },
    );
}
