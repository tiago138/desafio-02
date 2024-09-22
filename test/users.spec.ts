import request from "supertest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

describe("users routes", () => {
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

    it("should be able to create a new user", async () => {
        await request(app.server)
            .post("/users/create-user")
            .send({
                name: "Lola Kirlin-Kihn",
                email: "Nora_Schinner@gmail.com",
            })
            .expect(201);
    });
});
