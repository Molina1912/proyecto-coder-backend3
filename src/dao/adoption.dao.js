// src/dao/adoption.dao.js
import { AdoptionModel } from '../models/adoption.model.js';

export class AdoptionDAO {
    async getAll() {
        return await AdoptionModel.find();
    }

    async getById(id) {
        return await AdoptionModel.findById(id);
    }

    async create(data) {
        return await AdoptionModel.create(data);
    }

    async update(id, data) {
        return await AdoptionModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await AdoptionModel.findByIdAndDelete(id);
    }
}