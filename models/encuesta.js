const mongoose = require('mongoose');

const encuestaSchema = new mongoose.Schema({
  idCamion: { type: String, required: true },
  tiempoEspera: { type: Number, required: true },
  calificacionCupo: { type: Number, min: 1, max: 5, required: true },
  calificacionConductor: { type: Number, min: 1, max: 5, required: true },
  calificacionConduccion: { type: Number, min: 1, max: 5, required: true },
  calificacionServicio: { type: Number, min: 1, max: 5, required: true },
  horaRespuesta: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Encuesta', encuestaSchema);