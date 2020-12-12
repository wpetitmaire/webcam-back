import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
const port = 3000;

app
    .use(morgan('dev'))
    .use(bodyParser.json());

// Ici nous placerons nos futurs points de terminaison.
require('./routes/archives/capturesPourUnDossier')(app);

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`)); 