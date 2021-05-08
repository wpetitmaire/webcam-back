import { log } from 'console';
import express from 'express';
import { ArchiveManager } from '../../components/archives/archiveManager';
import { apiResponse } from '../routes';
import { Archive } from './../../components/archives/archive';

/**
 * Récupérer la liste des archives (toutes, sur une année, un mois ou une journée)
 */
module.exports = (app: express.Application) => {
    app.get('/api/archives', (req: express.Request, res: express.Response) => {

        const apiParams: Archive.initConfiguration = {
            year: (req.query.year) ? parseInt(<string>req.query.year) : undefined,
            month: (req.query.month) ? parseInt(<string>req.query.month) : undefined,
            day: (req.query.day) ? parseInt(<string>req.query.day) : undefined,
        };

        log(apiParams)

        const archiveManager = new ArchiveManager(apiParams);

        archiveManager.getDataDescription().then( data => {
     
            let message = '';

            if(req.query.year && !req.query.month && !req.query.day)
                message = `${data.length} mois archivé(s) pour l'année ${req.query.year}.`;
            else if(req.query.year && req.query.month && !req.query.day)
                message = `${data.length} jour(s) archivé(s) pour le mois ${req.query.month} de l'année ${req.query.year}.`;
            else if(req.query.year && req.query.month && req.query.day)
                message = `${data.length} archives trouvées au ${req.query.day}/${req.query.month}/${req.query.year}.`;
            else
                message = `${data.length} année(s) archivée(s).`;

            const response: apiResponse = { message, data };
            res.json(response); 
        }).catch(erreur => { 
            res.status(500).json({ message: erreur })
        }); 
    });
}; 