import express from 'express';
import moment from 'moment';
import { ArchiveManager } from '../../components/archives/archiveManager';
import { apiResponse } from '../routes';
import { Archive } from './../../components/archives/archive';

/**
 * Récupération de la liste des captures
 */
module.exports = (app: express.Application) => {
    app.get('/api/archives', (req: express.Request, res: express.Response) => {

        // Filtre sur l'année
        if(req.query.year) {

            const apiParams: Archive.initConfiguration = {
                year: parseInt(<string>req.query.year),
                month: (req.query.month) ? parseInt(<string>req.query.month) : undefined,
                day: (req.query.day) ? parseInt(<string>req.query.day) : undefined,
            }

            console.log(apiParams)

            const archiveManager = new ArchiveManager(apiParams);
            archiveManager.getFilesDescription().then((retour: Archive.fileDescription[]) => {
     
                let message = '';

                if(req.query.year && !req.query.month && !req.query.day)
                    message = `${retour.length} dossier(s) ont été trouvé sur la période ${req.query.year}.`;
                else if(req.query.year && req.query.month && !req.query.day)
                    message = `${retour.length} dossier(s) ont été trouvé sur la période ${req.query.month}/${req.query.year}.`;
                else if(req.query.year && req.query.month && req.query.day)
                    message = `${retour.length} dossier(s) ont été trouvé sur la période ${req.query.day}/${req.query.month}/${req.query.year}.`;

                const response: apiResponse = {
                    message: message, 
                    data: retour
                };
                res.json(response); 
            }).catch(erreur => { 
                res.status(500).json({ message: erreur })
            }); 
        }
        // Recherche sans filtre
        else {

            const archiveManager = new ArchiveManager();
            archiveManager.getFilesDescription().then((retour: Archive.fileDescription[]) => {
     
                const response: apiResponse = {
                    message: `${retour.length} élément(s) ont été trouvé(s)`, 
                    data: retour
                };
                res.json(response); 
            }).catch(erreur => {
                console.log(erreur);
                res.status(500).json({ message: erreur })
            }); 
        }

    
    });
}; 