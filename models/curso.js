const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cursoSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    nombre: String,
    descripcion: String,
    alumnos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alumno'
        }
    ]
});

const Curso = mongoose.model('Curso', cursoSchema);
module.exports = Curso;
