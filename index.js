const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser');
const Encuesta = require('./models/encuesta');

const app = express();
app.use(express.json())
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true)
  }
}))

mongoose.connect('mongodb://localhost:27017/encuestasAutobus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//Crear encuestas 
app.post('/encuestas', async (req, res) => {
    try {
      const encuesta = new Encuesta(req.body);
      await encuesta.save();
      res.status(201).send(encuesta);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  //obtener todas las encuestas 
  app.get('/encuestas', async (req, res) => {
    try {
      const encuestas = await Encuesta.find({});
      res.send(encuestas);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //Obtener promedios por Id de camion 
  app.get('/promedios/:idCamion', async (req, res) => {
    try {
      const encuestas = await Encuesta.find({ idCamion: Number(req.params.idCamion) });
  
      if (encuestas.length === 0) {
        return res.status(404).send({ error: 'No se encontraron encuestas para este camión.' });
      }
  
      const promedios = {
        tiempoEspera: encuestas.reduce((sum, e) => sum + e.tiempoEspera, 0) / encuestas.length,
        calificacionLlegada: encuestas.reduce((sum, e) => sum + e.calificacionCupo, 0) / encuestas.length,
        calificacionConductor: encuestas.reduce((sum, e) => sum + e.calificacionConductor, 0) / encuestas.length,
        calificacionConduccion: encuestas.reduce((sum, e) => sum + e.calificacionConduccion, 0) / encuestas.length,
        servicioGeneral: encuestas.reduce((sum, e) => sum + (e.calificacionLlegada + e.calificacionConductor + e.calificacionConduccion) / 3, 0) / encuestas.length
      };
  
      res.send(promedios);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});