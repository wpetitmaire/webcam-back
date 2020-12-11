import express from 'express';

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
    
        res.send('OK');
    });
};