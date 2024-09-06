import { expect } from "chai";
import supertest, { agent } from "supertest";
import envConfig from "../src/config/env.config.js";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test carts", () => {
    let cookie;
    before(async () => {
        const loginUser = {
            email: "userpremium@test.com",
            password: "1234",
        };

        const { headers } = await requester.post("/api/session/login").send(loginUser);

        const cookieResult = headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };
    });

    let cartId;

    it("[POST] /api/carts este endpoint debe crear un carrito", async () => {
        const newCart = {
            products: []
        };

        const { status, _body, ok } = await requester
            .post("/api/carts")
            .send(newCart)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        cartId = _body.payload._id;

        expect(status).to.be.equal(201);
        expect(ok).to.be.equal(true);
        expect(_body.payload.products).to.be.an("array");
    });

    it("[GET] /api/carts/:cid este endpoint debe devolver un carrito", async () => {
        const { status, _body, ok } = await requester.get(`/api/carts/${cartId}`);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.products).to.be.an("array");
    });


    it("[DELETE] /api/carts/:cid este endpoint debe eliminar un carrito", async () => {
        const { status, _body, ok } = await requester
            .delete(`/api/carts/${cartId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
    });
});