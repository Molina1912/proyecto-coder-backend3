// src/services/adoption.service.js
import { AdoptionDAO } from '../dao/adoption.dao.js';
import { logger } from '../utils/logger.js';

export class AdoptionService {
    constructor() {
        this.dao = new AdoptionDAO();
    }

    async getAllAdoptions() {
        logger.http('Obteniendo todas las adopciones');
        return await this.dao.getAll();
    }

    async getAdoptionById(id) {
        logger.http(`Obteniendo adopción con id: ${id}`);
        return await this.dao.getById(id);
    }

    async createAdoption(data) {
        logger.info('Creando nueva adopción');
        return await this.dao.create(data);
    }

    async updateAdoption(id, data) {
        logger.info(`Actualizando adopción con id: ${id}`);
        return await this.dao.update(id, data);
    }

    async deleteAdoption(id) {
        logger.info(`Eliminando adopción con id: ${id}`);
        return await this.dao.delete(id);
    }
}