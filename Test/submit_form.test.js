import request from 'supertest';
import { createServer } from '../server'; // Adjust the import if necessary

describe('POST /submit-inventory', () => {
  it('should submit inventory and return 200', async () => {
    const response = await request(createServer()).post('/submit-inventory').send({ clientId: '123', inventoryItems: ['Bed', 'TV'] });
    expect(response.statusCode).toBe(200);
  });

  it('should return 400 for missing clientId', async () => {
    const response = await request(createServer()).post('/submit-inventory').send({ inventoryItems: ['Bed', 'TV'] });
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 for missing inventoryItems', async () => {
    const response = await request(createServer()).post('/submit-inventory').send({ clientId: '123' });
    expect(response.statusCode).toBe(400);
  });
});