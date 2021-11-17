const request = require("supertest");
const Activity = require("../src/models/activity");
const app = require("../src/app");
const {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	activityOne,
	activityOneId,
	activityTwo,
	activityTwoId,
	activityThree,
	activityThreeId,
	populateDatabase
} = require("./fixtures/db");

beforeEach(populateDatabase);

test("Create Activity", async () => {
	const response = await request(app)
		.post("/activity")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			category: "Travel",
			type: "Two Wheelers, Scooter",
			co2_emission: 0.03425,
			mode: "Land",
			total_emission: 0.17125,
			distance: 5,
			category: "Travel"
		})
		.expect(200);

	const activity = await Activity.findById(response.body._id);
	expect(activity).not.toBeNull();
	expect(activity.owner.toString()).toBe(userOneId.toString());
});

test("Get User's activities", async () => {
	const response = await request(app)
		.get("/activity")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	expect(response.body.length).toBe(2);
	expect(
		response.body.every(
			(activity) => activity.owner.toString === userOneId.toString()
		)
	);
});

test("Delete unauthorized activity", async () => {
	await request(app)
		.delete(`/activity/${activityOneId.toString()}`)
		.set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);
	const activity = await Activity.findById(activityOneId);
	expect(activity).not.toBeNull();
});

test("Delete authorized activity", async () => {
	await request(app)
		.delete(`/activity/${activityOneId.toString()}`)
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	const activity = await Activity.findById(activityOneId);
	expect(activity).toBeNull();
});
