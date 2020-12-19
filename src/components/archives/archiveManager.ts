import { Archive } from './archive';
import moment from 'moment';

import fs from 'fs-extra';

class ArchiveManager {

    private startPath: string;
    private debugMode: boolean;
    private date: moment.Moment;

    constructor(parameters: Archive.initConfiguration) {
        this.startPath = parameters.startPath;
        this.debugMode = parameters.debugMode || false;
        this.date = parameters.date;
    };

    log(message: string): void {

        if(!this.debugMode)
            return;
             
        console.log(`(archiveManager) - ${message}`);
    }
  
    /**
     * Renvoie la description des éléments présents dans le dossier
     */
    getFilesDescription(): Promise<Archive.fileDescription[]> {
        this.log(`getFilesDescription : ${this.startPath}`);

        // Création d'une promesse qui effectue toutes les recherches
        return new Promise((sucess, fail) => {

            // Lecture du répertoire
            fs.readdir(this.startPath, (err, files) => {

                // S'il y a une erreur, on rompt la promesse avec le contenu de l'erreur.
                if(err) {
                    fail(err);
                    return;
                }
                
                // On ressoud notre promesse avec le contenu d'une autre promesse sur la recherche des caractéristiques des fichiers récupérés
                sucess(new Promise((sucess, fail) => {
                                        
                    // Liste qui va contenir la liste des promesses, une pour chaque récupération de statistiques d'un fichier
                    const promises: any = [];

                    // On parcourt les fichiers ...
                    files.forEach((file) => {

                        // Ajout de la nouvelle promesse à la liste
                        promises.push(new Promise((sucess, fail) => {

                            const pathToSearch: string = `${this.startPath}${file}`;

                            // Récupération des statistiques pour le fichier
                            fs.lstat(pathToSearch, (err, stats) => {

                                // Si erreur, on rompt la promesse avec le contenu de l'erreur
                                if(err) {
                                    fail(err);
                                    return;
                                }
        
                                // On créer l'objet avec les caractéristiques du fichier
                                const data: Archive.fileDescription = {
                                    name: file,
                                    isFile: stats.isFile(),
                                    date: stats.birthtime
                                };
            
                                // On ressoud la promesse avec le contenu de l'objet fraichement créé.
                                sucess(data);
                            });
                        }))
                    })

                    // On ressoud toutes les promesses crées lors du parcourt des fichiers et on retourne le résultat à la promesse de départ.
                    sucess(Promise.all(promises))
                })) 
            })
        }); 
    };
}

export {ArchiveManager};