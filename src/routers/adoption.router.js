// src/routers/adoption.router.js
import { Router } from 'express';
import { AdoptionService } from '../services/adoption.service.js';

const router = Router();
const adoptionService = new AdoptionService();

// GET /api/adoption - Obtener todas las adopciones
router.get('/', async (req, res) => {
    try {
        const adoptions = await adoptionService.getAllAdoptions();
        res.status(200).send({ status: 'success', payload: adoptions });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// GET /api/adoption/:id - Obtener adopción por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const adoption = await adoptionService.getAdoptionById(id);
        if (!adoption) return res.status(404).send({ status: 'error', message: 'Adopción no encontrada' });
        res.status(200).send({ status: 'success', payload: adoption });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// POST /api/adoption - Crear nueva adopción
router.post('/', async (req, res) => {
    try {
        const newAdoption = await adoptionService.createAdoption(req.body);
        res.status(201).send({ status: 'success', payload: newAdoption });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// PUT /api/adoption/:id - Actualizar adopción
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAdoption = await adoptionService.updateAdoption(id, req.body);
        res.status(200).send({ status: 'success', payload: updatedAdoption });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// DELETE /api/adoption/:id - Eliminar adopción
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await adoptionService.deleteAdoption(id);
        res.status(200).send({ status: 'success', message: 'Adopción eliminada' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;