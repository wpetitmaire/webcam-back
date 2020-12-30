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

        console.log('ICI') 
 
        const archiveManager = new ArchiveManager({ startPath: './../test_snaps/' });
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