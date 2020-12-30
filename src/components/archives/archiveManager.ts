import { Archive } from './archive';
import moment from 'moment';
import fs from 'fs-extra';

const excludedNames = ['.DS_Store', 'lastsnap.jpg'];
class ArchiveManager {

    private startPath: string;
    private debugMode: boolean;
    private date: moment.Moment | any;

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
 
        let pathToSearch = '';

        if(moment.isMoment(this.date)) {

            const year = this.date.year();
            const month = this.date.month() + 1; 
            const day = this.date.date(); 
            pathToSearch = `${this.startPath}/${year}/${month}/${day}/`;
        }
        else
            pathToSearch = this.startPath;


        // Création d'une promesse qui effectue toutes les recherches
        return new Promise((sucess, fail) => {

            // Tester l'existence de l'arborescence 
            // console.log('--> TEST EXISTENCE') 
            fs.pathExists(pathToSearch).then(exists => { 

                // On rompt la promesse si l'arboresence n'existe pas
                if(!exists) {

                    fail(`Aucun élément trouvé pour le dossier ${pathToSearch}`);
                    return;
                }

                // Lecture du répertoire
                    fs.readdir(pathToSearch, (err, files) => { 

                        // S'il y a une erreur, on rompt la promesse avec le contenu de l'erreur.
                        if(err) {
                            fail(err);
                            return;
                        }
 
                        // Exlusion des éléments indésirables
                        files = files.filter(file => !excludedNames.includes(file)); 
                        
                        // On ressoud notre promesse avec le contenu d'une autre promesse sur la recherche des caractéristiques des fichiers récupérés
                        sucess(new Promise((sucess, fail) => {
                                                
                            // Liste qui va contenir la liste des promesses, une pour chaque récupération de statistiques d'un fichier
                            const promises: any = [];

                            // On parcourt les fichiers ...
                            files.forEach((file) => {

                                // Ajout de la nouvelle promesse à la liste
                                promises.push(new Promise((sucess, fail) => {

                                    const fileToSearch: string = `${pathToSearch}${file}`;

                                    // Récupération des statistiques pour le fichier
                                    fs.lstat(fileToSearch, (err, stats) => {

                                        // Si erreur, on rompt la promesse avec le contenu de l'erreur
                                        if(err) {
                                            fail(err);
                                            return;
                                        }
                
                                        // On créer l'objet avec les caractéristiques du fichier
                                        const data: Archive.fileDescription = {
                                            name: stats.isFile() == true ? `${file.substring(0,2)}:${file.substring(2,4)}:${file.substring(4,6)}` : file,
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

            }) 
    };


}

export {ArchiveManager};