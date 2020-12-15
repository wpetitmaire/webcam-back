import express from 'express';
import { ArchiveManager } from '../../components/archives/archiveManager';

/**
 * Récupération de la liste des captures
 */
module.exports = (app: express.Application) => {
    app.get('/api/archives', (req: express.Request, res: express.Response) => {

        // La date est obligatoire
        // if(!req.params.date) {
        //     const message: string = `Renseigner une date pour rechercher les captures du dossier associé.`;
        //     res.status(400).json({message});
        // }

        const archiveManager = new ArchiveManager({ startPath: './../test_snaps/' });
        // archiveManager.getFilesDescription();
        archiveManager.getFilesDescription().then((retour: any) => {

            console.log('--FINI')
            console.log(retour);
            // res.json({ data: retour }); 
            // res.json({ message: 'OK' }); 
            const message = `RECHERCHE OK`;
            res.json({ message, data: retour }); 
        })
    
    });
};