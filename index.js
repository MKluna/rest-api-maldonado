const express = require('express');
const mongoose = require('mongoose');
const alumnosRouter = require('./routes/alumnos.js');
const cursosRouter = require('./routes/cursos.js');

const app = express();

mongoose.connect('mongodb://localhost:27017/mi-base-de-datos', { useNewUrlParser: true });

app.use(express.json());

app.use('/alumnos', alumnosRouter);
app.use('/cursos', cursosRouter);

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
