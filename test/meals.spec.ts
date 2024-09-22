import request from "supertest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("meals routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    });

    it("should be able to create a meal", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies)
            .expect(201);
    });

    it("should be able to list all meal", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        const listMealsResponse = await request(app.server)
            .get("/meals")
            .set("Cookie", cookies)
            .expect(200);

        expect(listMealsResponse.body.meals).toEqual([
            expect.objectContaining({
                name: "Macarão 3",
                description: "Alguma variação",
            }),
        ]);
    });

    it("should be able to get a specific meal", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        const listMealsResponse = await request(app.server)
            .get("/meals")
            .set("Cookie", cookies)
            .expect(200);

        const mealId = listMealsResponse.body.meals[0].id;

        const getMealResponse = await request(app.server)
            .get(`/meals/${mealId}`)
            .set("Cookie", cookies)
            .expect(200);

        expect(getMealResponse.body.meal).toEqual(
            expect.objectContaining({
                id: mealId,
                name: "Macarão 3",
                description: "Alguma variação",
            }),
        );
    });

    it("should be able to update a specific meal", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        const listMealsResponse = await request(app.server)
            .get("/meals")
            .set("Cookie", cookies)
            .expect(200);

        const mealId = listMealsResponse.body.meals[0].id;

        await request(app.server)
            .put(`/meals/${mealId}`)
            .send({ name: "Macarão" })
            .set("Cookie", cookies)
            .expect(201);

        const getMealResponse = await request(app.server)
            .get(`/meals/${mealId}`)
            .set("Cookie", cookies)
            .expect(200);

        expect(getMealResponse.body.meal).toEqual(
            expect.objectContaining({
                id: mealId,
                name: "Macarão",
                description: "Alguma variação",
            }),
        );
    });

    it("should be able to delete a specific meal", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        const listMealsResponse = await request(app.server)
            .get("/meals")
            .set("Cookie", cookies)
            .expect(200);

        const mealId = listMealsResponse.body.meals[0].id;

        await request(app.server)
            .delete(`/meals/${mealId}`)
            .set("Cookie", cookies)
            .expect(201);

        const getMealResponse = await request(app.server)
            .get(`/meals/${mealId}`)
            .set("Cookie", cookies)
            .expect(200);

        expect(getMealResponse.body.meal).toEqual(undefined);
    });

    it("should be able to get summary", async () => {
        const createUserResponse = await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            });

        const cookies = createUserResponse.get("Set-Cookie");

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: false,
            })
            .set("Cookie", cookies);

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        await request(app.server)
            .post("/meals")
            .send({
                name: "Macarão 3",
                description: "Alguma variação",
                date: new Date(),
                isWithinDiet: true,
            })
            .set("Cookie", cookies);

        const summaryResponse = await request(app.server)
            .get("/meals/summary")
            .set("Cookie", cookies)
            .expect(200);

        expect(summaryResponse.body).toEqual({
            mealsAmount: 5,
            mealsWithinTheDietAmount: 4,
            mealsOutsideTheDietAmount: 1,
            bestMealSequenceAmount: 2,
        });
    });
});
