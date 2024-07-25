import verifyJWT from "../JWTAuth";
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());
app.use(verifyJWT())
app.get('/', (req, res) => res.status(200).send(`hello ${req.userId}`));

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM2ZGIwZWI4MDQzOWMwNjI0ZjE2OGYiLCJpYXQiOjE3MTQ4NzEwNTQsImV4cCI6MTc0NjQwNzA1NH0.Js7n8N6uBeoWBoIPw6XEif6XATWQux7crUMX1ttoXkc';

it('can verify jwt', async () => {
    const res = await request(app)
        .get('/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    expect(res.text).toBe(`hello 6636db0eb80439c0624f168f`);
});