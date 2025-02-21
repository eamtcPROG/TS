const request = require('supertest');
const app = require('../index'); // Import your Express app

describe('Express App with index.js', () => {
  // Test 1: Check that GET / returns a welcome message.
  it('should return a welcome message on GET /', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
      
    expect(res.body).toHaveProperty('message', 'Welcome to my Express app!');
  });

  // Test 2: GET /users should return an empty array initially.
  it('should return an empty array on GET /users', async () => {
    
    const res = await request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200);
      
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // Test 3: Verify that POST /users creates a new user.
  it('should create a new user on POST /users', async () => {
    const newUser = { name: "Alice", email: "alice@example.com" };
    const res = await request(app)
      .post('/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201);
      
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newUser.name);
  });

  // Test 4: Ensure that an undefined route returns a 404 error.
  it('should return 404 for a non-existent route', async () => {
    await request(app)
      .get('/non-existent')
      .expect(404);
  });

  // Test 5: GET /users/:id returns a created user.
  it('should return a created user on GET /users/:id', async () => {
    const newUser = { name: "Bob", email: "bob@example.com" };
    const postRes = await request(app)
      .post('/users')
      .send(newUser)
      .expect('Content-Type', /json/)
      .expect(201);
    
    const createdUserId = postRes.body.id;
    const getRes = await request(app)
      .get(`/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(getRes.body).toHaveProperty('id', createdUserId);
    expect(getRes.body).toHaveProperty('name', newUser.name);
  });

  // Test 6: PUT /users/:id updates the user and returns the updated information.
  it('should update an existing user on PUT /users/:id', async () => {
    const newUser = { name: "Charlie", email: "charlie@example.com" };
    const postRes = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);
      
    const createdUserId = postRes.body.id;

    // Now, update the user.
    const updatedData = { name: "Charles", email: "charles@example.com" };
    const putRes = await request(app)
      .put(`/users/${createdUserId}`)
      .send(updatedData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(putRes.body).toHaveProperty('id', createdUserId);
    expect(putRes.body).toHaveProperty('name', updatedData.name);
  });
});
