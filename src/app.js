// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import adoptionRouter from './routers/adoption.router.js';
import { logger } from './utils/logger.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/adoption', adoptionRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de Adopciones funcionando correctamente ');
});

// Middleware de manejo de errores (Aplicando Clase 2)
app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 8080;

const init = async () => {
    await connectDB();
    app.listen(PORT, () => {
        logger.info(`Servidor corriendo en el puerto ${PORT}`);
    });
};

init();