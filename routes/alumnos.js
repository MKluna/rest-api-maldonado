const express = require('express');
const Alumno = require('../models/alumno');
const router = express.Router();

/* Este bloque de código define una ruta para manejar las solicitudes HTTP POST para crear un nuevo
recurso "Alumno" (estudiante). Extrae las propiedades "nombre" y "apellido" del cuerpo de la
solicitud, crea un nuevo objeto "Alumno" con esas propiedades, lo guarda en la base de datos y envía
el objeto "Alumno" guardado como respuesta. Si hay un error durante el proceso, envía un código de
estado 500 con el mensaje de error como respuesta. */
router.post('/', async (req, res) => {
    const { nombre, apellido } = req.body;

    try {
        const alumno = new Alumno({ nombre, apellido });
        await alumno.save();
        res.send(alumno);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta para manejar las solicitudes HTTP GET para recuperar todos los recursos
de "Alumno" (estudiante) de la base de datos. Utiliza el método `Alumno.find()` para recuperar todos
los documentos de la colección "Alumno" y los envía como respuesta. Si hay un error durante el
proceso, envía un código de estado de 500 con el mensaje de error como respuesta. */
router.get('/', async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.send(alumnos);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta para manejar solicitudes HTTP GET para recuperar un recurso específico
de "Alumno" (estudiante) de la base de datos. Utiliza el método `findById()` para recuperar el
documento con el parámetro `id` especificado y rellena el campo `cursos.curso` con el documento
`Curso` (curso) correspondiente. Si el documento no se encuentra, envía un código de estado 404 con
el mensaje "Alumno no encontrado". Si hay un error durante el proceso, envía un código de estado 500
con el mensaje de error como respuesta. */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const alumno = await Alumno.findById(id).populate('cursos.curso');
        if (!alumno) {
            return res.status(404).send('Alumno no encontrado');
        }
        res.send(alumno);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta para manejar solicitudes HTTP PUT para actualizar un recurso específico
de "Alumno" (estudiante) en la base de datos. Extrae el parámetro `id` y las propiedades `nombre` y
`apellido` del cuerpo de la solicitud. Luego usa el método `findByIdAndUpdate()` para encontrar y
actualizar el documento con el `id` especificado, configurando las propiedades `nombre` y `apellido`
a los nuevos valores. La opción `{ new: true }` asegura que se devuelva el documento actualizado. Si
el documento no se encuentra, envía un código de estado 404 con el mensaje "Alumno no encontrado".
Si hay un error durante el proceso, envía un código de estado 500 con el mensaje de error como
respuesta. Finalmente, envía el objeto `alumno` actualizado como respuesta. */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido } = req.body;

    try {
        const alumno = await Alumno.findByIdAndUpdate(
            id,
            { nombre, apellido },
            { new: true }
        );
        if (!alumno) {
            return res.status(404).send('Alumno no encontrado');
        }
        res.send(alumno);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* Este código define una ruta para manejar las solicitudes HTTP DELETE para eliminar un recurso
específico de "Alumno" (estudiante) de la base de datos. Extrae el parámetro `id` de los parámetros
de la solicitud, utiliza el método `findByIdAndDelete()` para buscar y eliminar el documento con el
`id` especificado y envía el objeto `alumno` eliminado como respuesta. Si el documento no se
encuentra, envía un código de estado 404 con el mensaje "Alumno no encontrado". Si hay un error
durante el proceso, envía un código de estado 500 con el mensaje de error como respuesta. */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const alumno = await Alumno.findByIdAndDelete(id);
        if (!alumno) {
            return res.status(404).send('Alumno no encontrado');
        }
        res.send(alumno);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
