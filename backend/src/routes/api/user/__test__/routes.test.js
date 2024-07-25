import request from 'supertest';
import express from 'express';
import routes from '#routes/routes';

const app = express();
app.use(routes);

describe('Main Routes Integration Tests', () => {
  it('should forward /api requests to the API router', async () => {
    const apiMock = jest.fn((req, res) => res.status(200).json({ message: 'API route' }));
    app.use('/api', apiMock);
    
    await request(app)
      .get('/api')
      .expect(200)
      .then(response => {
        expect(response.body).toEqual({ message: 'API route' });
        expect(apiMock).toHaveBeenCalled();
      });
  });
});
