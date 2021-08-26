const request = require("supertest");
const User = require("../src/models/user");
const app = require("../src/app");
const { userOne, userOneId, populateDatabase } = require("./fixtures/db");

beforeEach(populateDatabase);

test("Creating User", async () => {
	await request(app)
		.post("/users")
		.send({
			name: "Abhishek",
			email: "akshaya@gmail.com",
			password: "Abhishek"
		})
		.expect(201);
});

test("Loging In Correct Credentials", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password
		})
		.expect(200);
	const user = await User.findById(userOneId);
	expect(user).not.toBeNull();
	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Logging In Wrong Credentials", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: "wrongpassword"
		})
		.expect(400);
});

test("Get Profile for Authorized User", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Get Profile for Unauthorized User", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Delete Authorized User", async () => {
	await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const user = await User.findById(userOneId);
	expect(user).toBeNull();
});

test("Delete Unauthorized User", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("Upload avatar", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/profile-pic.jpg")
		.expect(200);
});

test("Update User with correct field", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ name: "User Two" })
		.expect(200);
	const user = await User.findById(userOneId);
	expect(user.name).toBe("User Two");
});

test("Update User with incorrect field", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ location: "Chennai" })
		.expect(400);
});
