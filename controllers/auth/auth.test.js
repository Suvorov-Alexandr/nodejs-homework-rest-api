/*eslint-disable*/
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const { User } = require("../../models/user");
require("dotenv").config();
const { DB_HOST, PORT, DB_NAME } = process.env;

describe("test auth routes", () => {
  let server;

  beforeAll(() => (server = app.listen(PORT)));

  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_HOST).then(() => done());
  });

  setTimeout(() => {
    afterEach((done) => {
      mongoose.connection.DB_NAME?.dropCollection(() => {
        mongoose.connection.close(() => done());
      });
    });
  }, 10000);

  test("test signup login logout current route", async () => {
    const newUser = {
      name: "brr",
      email: "brr@gmail.com",
      password: "1234567",
      avatarURL:
        "https://s.gravatar.com/avatar/74f1242b04a86ab7e7412dabf93a925e",
      subscription: "starter",
    };

    const loginUser = {
      email: newUser.email,
      password: newUser.password,
    };

    const userCreationResponse = await request(app)
      .post("/api/auth/signup")
      .send(newUser);

    const { name, email, password, avatarURL, subscription } =
      userCreationResponse.body.data.user;

    expect(userCreationResponse.statusCode).toBe(201);
    expect(typeof name).toBe("string");
    expect(typeof email).toBe("string");
    expect(typeof avatarURL).toBe("string");
    expect(typeof subscription).toBe("string");
    expect(password).toBeUndefined();
    expect(
      Object.prototype.toString.call(userCreationResponse.body) ===
        "[object Object]"
    ).toBeTruthy();

    const alreadyUserCreationResponse = await request(app)
      .post("/api/auth/signup")
      .send(newUser);

    expect(alreadyUserCreationResponse.statusCode).toBe(409);
    expect(alreadyUserCreationResponse.text).toBe(
      alreadyUserCreationResponse.error.text
    );

    const userLoginResponse = await request(app)
      .post("/api/auth/login")
      .send(loginUser);
    expect(userLoginResponse.statusCode).toBe(200);
    expect(typeof email).toBe("string");
    expect(password).toBeUndefined();
    const { data } = userLoginResponse.body;

    expect(data.token).toBeTruthy();
    const { token } = await User.findOne({ email: newUser.email });
    expect(token).toBe(token);

    const userNotLoginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: "brr@gmail.com", password: "12345678" });

    expect(userNotLoginResponse.statusCode).toBe(401);
    expect(userNotLoginResponse.text).toBe(userNotLoginResponse.error.text);

    const userCurrentResponse = await request(app)
      .get("/api/users/current")
      .set("authorization", `Bearer ${token}`)
      .send(name, email, subscription);

    expect(userCurrentResponse.statusCode).toBe(200);
    expect(typeof token).toBe("string");
    expect(typeof name).toBe("string");
    expect(typeof email).toBe("string");
    expect(typeof subscription).toBe("string");

    const updateSubscriptionResponse = await request(app)
      .patch("/api/users")
      .set("authorization", `Bearer ${token}`)
      .send({ subscription: "business" });

    expect(updateSubscriptionResponse.statusCode).toBe(200);
    expect(typeof subscription).toBe("string");

    const notFoundSubscriptionResponse = await request(app)
      .patch("/api/users")
      .set("authorization", `Bearer ${token}`)
      .send({ subscription: "" });

    expect(notFoundSubscriptionResponse.statusCode).toBe(400);
    expect(notFoundSubscriptionResponse.text).toBe(
      notFoundSubscriptionResponse.error.text
    );

    const notUpdateSubscriptionResponse = await request(app)
      .patch("/api/users/1")
      .set("authorization", `Bearer ${token}`)
      .send({ subscription: "business" });

    expect(notUpdateSubscriptionResponse.statusCode).toBe(404);
    expect(notUpdateSubscriptionResponse.text).toBe(
      notUpdateSubscriptionResponse.error.text
    );

    const userLogoutResponse = await request(app)
      .get("/api/auth/logout")
      .set("authorization", `Bearer ${token}`)
      .send({ token: null });
    expect(typeof token).toBe("string");
    expect(userLogoutResponse.statusCode).toBe(204);

    const notFoundResponse = await request(app).get("/api/v1");

    expect(notFoundResponse.statusCode).toBe(404);
    expect(notFoundResponse.text).toBe(notFoundResponse.error.text);

    // await User.findOneAndRemove({ email });
    console.log("DONE!");
  });
});

//--coverage
