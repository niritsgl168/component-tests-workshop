// 🏅 Your mission is to create your first integration tests here 💜
// 🏝 Response island
// ✅ Whenever you see this icon, there's a TASK for you
// ✅🚀 This symbol represents an advanced task
// 💡 - This is an ADVICE symbol, it will appear nearby most tasks and help you in fulfilling the tasks

const request = require('supertest');
const nock = require('nock');
const {
  startWebServer,
  stopWebServer,
} = require('../src/entry-points/sensors-api');
const { getShortUnique, getSensorEvent } = require('./test-helper');
const sinon = require('sinon');
const SensorsService = require('../src/domain/sensors-service');

let expressApp;

beforeAll(async () => {
  expressApp = await startWebServer();
});

afterAll(async () => {
  await stopWebServer();
});

beforeEach(() => {
  nock('http://localhost').get('/notification').reply(200, {
    success: true,
  });
});

afterEach(() => {
  sinon.restore();
});

describe('Sensors test', () => {
  // ✅ TASK: Run the testing and ensure the the next simplistic test pass
  test('Just checking that testing works on your machine', () => {
    expect('Me boosting my testing knowledge in the workshop').toBeTruthy();
    // 💡 TIP: The the tests in watch mode: npm run test:dev
    // 💡 TIP: When in watch mode, within the terminal/CMD type "p" -> Then start typing this file name, choose it
    //  It should run only this file. Click "w" to return to the main menu
  });

  // ✅ TASK: Test that when a new event is posted to /event route, if category or temperature are not specified -> the API returns HTTP 400
  // 💡 TIP: Down below, there is an example event schema
  test('When category is not specified, should get http 400 error', async () => {
    // Arrange
    const eventToAdd = getSensorEvent({
      category: undefined
      // 💡 TIP: Consider explicitly specify that category is undefined by assigning 'undefined'
    });


    // Act
    const response = await request(expressApp).post("/sensor-events").send(eventToAdd);
    // 💡 TIP: use any http client lib like Axios OR supertest
    // 💡 TIP: This is how it is done with Supertest -> await request(expressApp).post("/sensor-events").send(eventToAdd);
    // Assert
    expect(response).toMatchObject({status: 400});
    // 💡 TIP: Check that the received response is indeed as stated in the test name
    // 💡 TIP: Use this syntax for example: expect(receivedResponse.status).toBe(...);
  });

  // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, we get back a valid response
  // 💡 TIP: Consider checking both the HTTP status and the body
  test('When inserting a valid event, should get successful response', async () => {
    const eventToAdd = getSensorEvent({
      // 💡 TIP: Consider explicitly specify that category is undefined by assigning 'undefined'
    });
    const response = await request(expressApp).post("/sensor-events").send(eventToAdd);
    expect(response).toMatchObject({status: 200, body: {...eventToAdd}});

    // Arrange
    // Act
    // 💡 TIP: use any http client lib like Axios OR supertest
    // 💡 TIP: This is how it is done with Supertest -> await request(expressApp).post("/sensor-events").send(eventToAdd);
    // Assert
    // 💡 TIP: You may check the body and the status all together with the following syntax:
    // expect(receivedResponse).toMatchObject({status: 200, body: {...}});
  });

  // ✅ TASK: Test that when a new valid event is posted to /sensor-events route, it's indeed retrievable from the DB
  // 💡 TIP: In the assert phase, query to get the event that was added
  // 💡 TIP: Whenever possible, use the public API for verification (not direct DB access)
  test('When inserting valid event, the event is retrievable from the API', async () => {
    const eventToAdd = getSensorEvent({
      // 💡 TIP: Consider explicitly specify that category is undefined by assigning 'undefined'
    });
    const {body: newEvent} = await request(expressApp).post("/sensor-events").send(eventToAdd);

    const {body: fetchedEvent} = await request(expressApp).get(`/sensor-events/${newEvent.id}`);

    expect(fetchedEvent).toMatchObject(newEvent);
  })

  // ✅ Keep the tests very short and readable, strive not to pass 7 statements per test
  // 💡 TIP: If it gets too long, extract obvious parts into an external helper

  // ✅🚀 TASK: Code the following test below
  test('When an internal unknown error occurs during request, Then get back 500 error', async () => {
    // Arrange
    // 💡 TIP: Factor a valid event here, otherwise the request will get rejected on start and the failure won't happen
    const eventToAdd = getSensorEvent({});
    sinon.stub(SensorsService.prototype, 'addEvent').rejects(new Error("Error explanation"));
    // 💡 TIP: Make some internal function fail, choose any class method
    const response = await request(expressApp).post("/sensor-events").send(eventToAdd);

    // 💡 TIP: Use the library sinon to alter the behaviour of existing function and make it throw error
    //  https://sinonjs.org/releases/latest/stubs/
    // 💡 TIP: Here is the syntax: sinon.stub(someClass.prototype, 'methodName').rejects(new Error("Error explanation"));
    // Act
    // Assert
    expect(response).toMatchObject({status: 500})
  });

  // ✅ Ensure that the webserver is closed when all the tests are completed
  // 💡 TIP: Use the right test hook to call the API and instruct it to close

  // ✅🚀 Spread your tests across multiple files, let the test runner invoke tests in multiple processes - Ensure all pass
  // 💡 TIP: You might face port collision where two APIs instances try to open the same port
  // 💡 TIP: Use the flag 'jest --maxWorkers=<num>'. Assign zero for max value of some specific number greater than 1
});
