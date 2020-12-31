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
            const year = parseInt(<string>req.query.year);
            const archiveManager = new ArchiveManager({ year });
            archiveManager.getFilesDescription().then((retour: Archive.fileDescription[]) => {
     
                const response: apiResponse = {
                    message: `${retour.length} dossier(s) ont été trouvé pour l'année ${year}.`, 
                    data: retour
                };
                res.json(response); 
            }).catch(erreur => { 
                console.log(erreur);
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