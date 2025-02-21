const { Given, When, Then, Before } = require('@cucumber/cucumber');
const request = require('supertest');
const assert = require('assert');
const app = require('../index'); 

let response;
let productPayload;
let createdProductId;

Before(() => {
  // Initialize a valid product payload before each scenario
  productPayload = { name: 'Gaming PC', price: 1500 };
});

Given('I have a valid product payload', function () {
  // productPayload is already set up in the Before hook
});

When('I send a POST request to {string}', async function (endpoint) {
  response = await request(app)
    .post(endpoint)
    .send(productPayload);
});

Then('I receive a response with status code {int}', function (statusCode) {
  assert.strictEqual(response.status, statusCode);
});

Then('the response contains a product ID', function () {
  assert.ok(response.body.id, 'Expected response to contain a product ID');
  createdProductId = response.body.id;
});

Given('a product has been created', async function () {
  // Create a product and save its ID for later retrieval
  const postResponse = await request(app)
    .post('/products')
    .send(productPayload);
  assert.strictEqual(postResponse.status, 201);
  assert.ok(postResponse.body.id, 'Expected product to have an ID');
  createdProductId = postResponse.body.id;
});

When('I send a GET request to {string}', async function (endpoint) {
  // Replace the placeholder {productId} in the endpoint with the actual product ID
  if (endpoint.includes('{productId}')) {
    endpoint = endpoint.replace('{productId}', createdProductId);
  }
  response = await request(app).get(endpoint);
});

Then('the product details match the created product', function () {
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.id, createdProductId);
  assert.strictEqual(response.body.name, productPayload.name);
  assert.strictEqual(response.body.price, productPayload.price);
});
