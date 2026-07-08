// tests/adoption.router.test.js
import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Crear los mocks ANTES de importar el router
const mockService = {
  getAllAdoptions: jest.fn(),
  getAdoptionById: jest.fn(),
  createAdoption: jest.fn(),
  updateAdoption: jest.fn(),
  deleteAdoption: jest.fn()
};

// Mockear el módulo del servicio
jest.unstable_mockModule('../src/services/adoption.service.js', () => ({
  AdoptionService: jest.fn(() => mockService)
}));

// Importar el router DESPUÉS de configurar el mock
const { default: adoptionRouter } = await import('../src/routers/adoption.router.js');

const app = express();
app.use(express.json());
app.use('/api/adoption', adoptionRouter);

describe('Tests funcionales del router adoption.router.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================
  // TESTS PARA GET /api/adoption
  // ========================================
  describe('GET /api/adoption - Obtener todas las adopciones', () => {
    test('Debe retornar todas las adopciones con status 200', async () => {
      const mockAdoptions = [
        { _id: '1', user: 'user1', pet: 'pet1', status: 'pending' },
        { _id: '2', user: 'user2', pet: 'pet2', status: 'approved' }
      ];
      
      mockService.getAllAdoptions.mockResolvedValue(mockAdoptions);

      const response = await request(app).get('/api/adoption');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.payload).toEqual(mockAdoptions);
      expect(mockService.getAllAdoptions).toHaveBeenCalledTimes(1);
    });

    test('Debe retornar array vacío si no hay adopciones', async () => {
      mockService.getAllAdoptions.mockResolvedValue([]);

      const response = await request(app).get('/api/adoption');
      
      expect(response.status).toBe(200);
      expect(response.body.payload).toEqual([]);
    });

    test('Debe retornar status 500 si hay error en el servicio', async () => {
      mockService.getAllAdoptions.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app).get('/api/adoption');
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Error de base de datos');
    });
  });

  // ========================================
  // TESTS PARA GET /api/adoption/:id
  // ========================================
  describe('GET /api/adoption/:id - Obtener adopción por ID', () => {
    test('Debe retornar una adopción específica con status 200', async () => {
      const mockAdoption = { 
        _id: '507f1f77bcf86cd799439011', 
        user: 'user1', 
        pet: 'pet1', 
        status: 'approved' 
      };
      
      mockService.getAdoptionById.mockResolvedValue(mockAdoption);

      const response = await request(app).get('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.payload).toEqual(mockAdoption);
      expect(mockService.getAdoptionById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    test('Debe retornar status 404 si la adopción no existe', async () => {
      mockService.getAdoptionById.mockResolvedValue(null);

      const response = await request(app).get('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Adopción no encontrada');
    });

    test('Debe retornar status 500 si hay error en el servicio', async () => {
      mockService.getAdoptionById.mockRejectedValue(new Error('Error al buscar'));

      const response = await request(app).get('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Error al buscar');
    });

    test('Caso de borde: ID con formato inválido', async () => {
      mockService.getAdoptionById.mockResolvedValue(null);

      const response = await request(app).get('/api/adoption/invalid-id');
      
      expect(response.status).toBe(404);
    });
  });

  // ========================================
  // TESTS PARA POST /api/adoption
  // ========================================
  describe('POST /api/adoption - Crear nueva adopción', () => {
    test('Debe crear una nueva adopción y retornar status 201', async () => {
      const newAdoption = {
        user: 'user1',
        pet: 'pet1',
        status: 'pending'
      };
      
      // CORRECCIÓN: Convertir la fecha a string ISO para la comparación
      const mockDate = new Date();
      const createdAdoption = {
        _id: '507f1f77bcf86cd799439011',
        ...newAdoption,
        date: mockDate.toISOString() // String ISO para comparar con la respuesta JSON
      };
      
      // El mock devuelve el objeto Date original
      mockService.createAdoption.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        ...newAdoption,
        date: mockDate
      });

      const response = await request(app)
        .post('/api/adoption')
        .send(newAdoption);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.payload).toEqual(createdAdoption);
      expect(mockService.createAdoption).toHaveBeenCalledWith(newAdoption);
    });

    test('Debe retornar status 500 si falta información requerida', async () => {
      mockService.createAdoption.mockRejectedValue(
        new Error('ValidationError: user and pet are required')
      );

      const response = await request(app)
        .post('/api/adoption')
        .send({ user: 'user1' });
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
    });

    test('Debe retornar status 500 si hay error en el servicio', async () => {
      mockService.createAdoption.mockRejectedValue(new Error('Error de conexión'));

      const response = await request(app)
        .post('/api/adoption')
        .send({ user: 'user1', pet: 'pet1' });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error de conexión');
    });

    test('Caso de borde: Body vacío', async () => {
      mockService.createAdoption.mockRejectedValue(
        new Error('ValidationError')
      );

      const response = await request(app)
        .post('/api/adoption')
        .send({});
      
      expect(response.status).toBe(500);
    });
  });

  // ========================================
  // TESTS PARA PUT /api/adoption/:id
  // ========================================
  describe('PUT /api/adoption/:id - Actualizar adopción', () => {
    test('Debe actualizar una adopción existente y retornar status 200', async () => {
      const updatedAdoption = {
        _id: '507f1f77bcf86cd799439011',
        user: 'user1',
        pet: 'pet1',
        status: 'approved'
      };
      
      mockService.updateAdoption.mockResolvedValue(updatedAdoption);

      const response = await request(app)
        .put('/api/adoption/507f1f77bcf86cd799439011')
        .send({ status: 'approved' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.payload.status).toBe('approved');
      expect(mockService.updateAdoption).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { status: 'approved' }
      );
    });

    test('Debe retornar status 500 si la adopción no existe', async () => {
      mockService.updateAdoption.mockRejectedValue(
        new Error('Adopción no encontrada')
      );

      const response = await request(app)
        .put('/api/adoption/507f1f77bcf86cd799439011')
        .send({ status: 'approved' });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Adopción no encontrada');
    });

    test('Debe retornar status 500 si hay error en el servicio', async () => {
      mockService.updateAdoption.mockRejectedValue(new Error('Error de actualización'));

      const response = await request(app)
        .put('/api/adoption/507f1f77bcf86cd799439011')
        .send({ status: 'rejected' });
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error de actualización');
    });

    test('Caso de borde: Body vacío en actualización', async () => {
      mockService.updateAdoption.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        user: 'user1',
        pet: 'pet1',
        status: 'pending'
      });

      const response = await request(app)
        .put('/api/adoption/507f1f77bcf86cd799439011')
        .send({});
      
      expect(response.status).toBe(200);
    });
  });

  // ========================================
  // TESTS PARA DELETE /api/adoption/:id
  // ========================================
  describe('DELETE /api/adoption/:id - Eliminar adopción', () => {
    test('Debe eliminar una adopción y retornar status 200', async () => {
      mockService.deleteAdoption.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011'
      });

      const response = await request(app).delete('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Adopción eliminada');
      expect(mockService.deleteAdoption).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    test('Debe retornar status 500 si la adopción no existe', async () => {
      mockService.deleteAdoption.mockRejectedValue(
        new Error('Adopción no encontrada')
      );

      const response = await request(app).delete('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Adopción no encontrada');
    });

    test('Debe retornar status 500 si hay error en el servicio', async () => {
      mockService.deleteAdoption.mockRejectedValue(new Error('Error al eliminar'));

      const response = await request(app).delete('/api/adoption/507f1f77bcf86cd799439011');
      
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error al eliminar');
    });

    test('Caso de borde: ID con formato inválido', async () => {
      mockService.deleteAdoption.mockRejectedValue(
        new Error('Invalid ID format')
      );

      const response = await request(app).delete('/api/adoption/invalid-id');
      
      expect(response.status).toBe(500);
    });
  });
});