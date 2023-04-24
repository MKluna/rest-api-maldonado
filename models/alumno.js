const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const alumnoSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    nombre: String,
    apellido: String,
    cursos: [
        {
            codigo: String,
            curso: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Curso'
            }
        }
    ]
});

const Alumno = mongoose.model('Alumno', alumnoSchema);

module.exports = Alumno;
