const express = require('express');
const router = express.Router();
const Curso = require('../models/curso');
const Alumno = require('../models/alumno');

/* Este código define una ruta para crear un nuevo curso. Escucha una solicitud POST a la URL raíz
('/') y espera que el cuerpo de la solicitud contenga una propiedad 'nombre' y 'descripcion'. Luego
crea una nueva instancia del modelo 'Curso' con las propiedades proporcionadas, lo guarda en la base
de datos y envía el objeto del curso guardado como respuesta. Si hay un error durante el proceso,
envía un código de estado 500 y el mensaje de error como respuesta. */
router.post('/', async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        const curso = new Curso({ nombre, descripcion });
        await curso.save();
        res.send(curso);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta para agregar un estudiante a un curso. Escucha una solicitud POST a una
URL que incluye la ID del curso y la ID del estudiante como parámetros. Luego encuentra el curso y
el estudiante en la base de datos usando sus respectivas ID. Si no se encuentra el curso o el
estudiante, envía una respuesta de error 404. Si el estudiante ya está inscrito en el curso, envía
una respuesta de error 400. De lo contrario, agrega al alumno a la lista de alumnos matriculados del
curso y guarda los cambios en la base de datos. También agrega el curso a la lista de cursos
inscritos del estudiante y guarda los cambios en la base de datos. Finalmente, envía el objeto
estudiante actualizado como respuesta. Si hay un error durante el proceso, envía una respuesta de
error 500 con el mensaje de error. */
router.post('/:id/alumnos/:alumnoId', async (req, res) => {
    const { id, alumnoId } = req.params;

    try {
        const curso = await Curso.findById(id);
        const alumno = await Alumno.findById(alumnoId);

        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }

        if (!alumno) {
            return res.status(404).send('Alumno no encontrado');
        }

        const cursoAlumno = curso.alumnos.find((a) => a.toString() === alumno._id.toString());

        if (cursoAlumno) {
            return res.status(400).send('El alumno ya está inscripto en este curso');
        }

        curso.alumnos.push(alumno._id);
        await curso.save();

        alumno.cursos.push({ codigo: curso.id, curso: curso._id });
        await alumno.save();

        res.send(alumno);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta que escucha una solicitud GET a la URL raíz ('/'). Cuando se recibe una
solicitud GET, utiliza el modelo `Curso` para encontrar todos los cursos en la base de datos y los
envía como respuesta. Si hay un error durante el proceso, envía una respuesta con un código de
estado de 500 y el mensaje de error. */
router.get('/', async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.send(cursos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta que escucha una solicitud GET a una URL que incluye un parámetro de ID.
Luego usa el modelo `Curso` para encontrar el curso con el ID especificado en la base de datos y
completa el campo `alumnos` con las propiedades `nombre` y `apellido` de cada estudiante inscrito en
el curso. Finalmente, envía el objeto del curso como respuesta. Si hay un error durante el proceso,
envía una respuesta con un código de estado de 500 y el mensaje de error. */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const curso = await Curso.findById(id).populate('alumnos', 'nombre apellido');
        res.send(curso);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta que escucha una solicitud PUT a una URL que incluye un parámetro de ID.
Luego usa el modelo `Curso` para encontrar el curso con el ID especificado en la base de datos y
actualiza sus propiedades `nombre` y `descripcion` con los valores proporcionados en el cuerpo de la
solicitud. Luego envía el objeto del curso actualizado como respuesta. Si hay un error durante el
proceso, envía una respuesta con un código de estado de 500 y el mensaje de error. */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    try {
        const curso = await Curso.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });
        res.send(curso);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta que escucha una solicitud DELETE a una URL que incluye un parámetro de
ID. Luego usa el modelo `Curso` para encontrar el curso con la ID especificada en la base de datos y
lo elimina. Si el borrado es exitoso, envía una respuesta con el mensaje "Curso eliminado
correctamente" (Curso eliminado con éxito). Si hay un error durante el proceso, envía una respuesta
con un código de estado de 500 y el mensaje de error. */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Curso.findByIdAndDelete(id);
        res.send('Curso eliminado correctamente');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
