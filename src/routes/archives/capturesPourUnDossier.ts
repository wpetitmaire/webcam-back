import express from 'express';
import moment from 'moment';
import { ArchiveManager } from '../../components/archives/archiveManager';
import { apiResponse } from '../routes';
import { Archive } from './../../components/archives/archive';

/**
 * Récupération de la liste des captures
 */
module.exports = (app: express.Application) => {
    app.get('/api/archives/:date', (req: express.Request, res: express.Response) => {
 
        const date = moment(req.params.date, 'DD-MM-YYYY');      
        console.log(date.get('year'), date.get('month'), date.get('date'))    

        // La date est obligatoire
        if(!date.isValid()) {

            const response: apiResponse = {
                message: `Renseigner une date valide. Exemple : 20-12-2019`,
                data: []
            };
            res.status(400).json(response);
        }

        const archiveManager = new ArchiveManager({ date: date });
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
    
    });
}; 