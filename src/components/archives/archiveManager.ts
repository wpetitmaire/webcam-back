import { Archive } from './archive';
import moment from 'moment';
import fs from 'fs-extra';
import { type } from 'os';

const excludedNames = ['.DS_Store', 'lastsnap.jpg'];
const enum typesOfSearching {
    all,
    year,
    month,
    day
}
class ArchiveManager {

    private readonly startPath = './../test_snaps/';
    private debugMode = false; 
    private date: moment.Moment | undefined;
    private year!: number | undefined;
    private startPoint = typesOfSearching.all;

    constructor(parameters?: Archive.initConfiguration) {
        
        if(!parameters)
            return;

        this.debugMode = parameters.debugMode || false;
        this.date = parameters.date;
        this.year = parameters.year;

        if(this.date)
            this.startPoint = typesOfSearching.day;
        else if(this.year)
            this.startPoint = typesOfSearching.year;
    };

    log(message: string): void {

        if(!this.debugMode)
            return;
             
        console.log(`(archiveManager) - ${message}`);
    }

    /**
     * Construit le chemin ou récupérer les éléments des archives
     */
    private getPathToSearch(): string {

        switch(this.startPoint) {

            case typesOfSearching.all:
                return this.startPath;

            case typesOfSearching.day:

                if(this.date) {

                    const year = this.date.year();
                    const month = this.date.month() + 1; 
                    const day = this.date.date(); 
                    return `${this.startPath}/${year}/${month}/${day}/`; 
                }

            case typesOfSearching.year:
                if(this.year)
                    return `${this.startPath}/${this.year}/`; 

            default:
                return '';
        }
    }
  
    /**
     * Renvoie la description des éléments présents dans le dossier
     */
    getFilesDescription(): Promise<Archive.fileDescription[]> {
        this.log(`getFilesDescription : ${this.startPath}`);
 
        let pathToSearch = this.getPathToSearch();

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