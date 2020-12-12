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

// import fs from 'fs-extra';

// const excludedFilesNames: string[] = ['.DS_Store']
// const startPath: string = '../test_snaps/2019/';

// // Lire le contenu d'un répertoire
// fs.readdir(startPath, (err, files) => {

//     if(err) {
//         return console.error(err);
//     }

//     files = files.filter(file => !excludedFilesNames.includes(file));

//     // console.log(files)

//     let parametrage: any[] = [];

//     // Récupération dex informations de chaque fichier
//     files.forEach((file) => {

//         const pathToSearch = startPath+file;
//         console.log(pathToSearch);

//         fs.lstat(pathToSearch, (err, stats) => {

//             const data = {
//                 name: file,
//                 isFile: stats.isFile(),
//                 date: stats.birthtime,
//             };
        
//             parametrage.push(data);

//             console.log(data)

//         });
//     });

// })