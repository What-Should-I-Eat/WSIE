//////////////////////////////////////////////////
// verification code test attempts

// const express = require('express');
// const endpoints = express.Router();
// jest.mock('express');

// describe("mock verification code calls", () => {
//     test("mock api call to user verify in New User", () => {


//         const mockedReponse = {data: {acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount: 1}};

//         express.put.mockResolvedValue(mockedResponse);
//         // const serverEndpoints = require('../../../server/routes/endpoints');
//         const verificationHandler = require("./verificationCode");

//         verificationHandler.updateVerificationStatusNewUser();
//     })
// });



//////////////////////////////////////////////////
// new user test attempts
// const supertest = require('supertest');
// const request = require('supertest');
// const endpoints = require('../../../server/routes/endpoints');
// const app = require('../../../server/app');
// const mongoose = require('mongoose');

// const express = require('express');
// const endpoints = express.Router();

// beforeEach(async () => {
//     const mongoUrl = 'mongodb://db/WSIE'; // Matches the service name in docker-compose.yml
//     await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// }, 30000);

// describe("POST /users/register", () => {
//     test("nominal user data added", async () => {
//         const response = await request(app).post("/api/v1/users/register").send({
//             fullName: "nick sonsini",
//             userName: "nick123",
//             password: "Test1234",
//             email: "nick@nick.com",
//             verificationCode: "123456",
//             diet: [],
//             health: [],
//             favorites: []
//         }, 10000);
//         expect(response.statusCode).toBe(200);
//     }, 20000);

// });