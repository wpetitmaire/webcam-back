import express from 'express';
import moment from 'moment';
import { type } from 'os';
import { ArchiveManager } from '../../components/archives/archiveManager';
import { apiResponse } from '../routes';
import { Archive } from './../../components/archives/archive';

/**
 * Récupération de la liste des captures
 */
module.exports = (app: express.Application) => {
    app.get('/api/archives/:date', (req: express.Request, res: express.Response) => {
 
        const date = moment(req.params.date, 'DD-MM-YYYY');  

        // La date est obligatoire
        if(!date.isValid()) {

            const response: apiResponse = {
                message: `Renseigner une date valide. Exemple : 20-12-2019`,
                data: []
            };
            res.status(400).json(response);
        }

        const archiveManager = new ArchiveManager({ startPath: './../test_snaps/', date: date });
        archiveManager.getFilesDescription().then((retour: Archive.fileDescription[]) => {
 
            const response: apiResponse = {
                message: `${retour.length} dossier(s) ont été trouvé(s)`, 
                data: retour
            };
            res.json(response); 
        }) 
    
    });
}; 