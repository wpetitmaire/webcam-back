import { Archive } from './archive'

import fs from 'fs-extra';

class archiveManager {

    private startPath: string;

    constructor(parameters: Archive.initConfiguration) {
        this.startPath = parameters.startPath;
    };

    log(message: string): void {
        console.log(`(archiveManager) - ${message}`);
    }

    /**
     * Renvoie la description des éléments présents dans le dossier
     */
    getFilesDescription(): Promise<Archive.fileDescription[]> {
        this.log(`getFilesDescription --> ${this.startPath}`);

        let parametrage: Archive.fileDescription[] = [];

        // Lecture du répertoire
        fs.readdir(this.startPath, (err, files) => {

            if(err) {
                return console.error(err);
            }


            // Parcourt de chaque fichier
            files.forEach((file) => {

                const pathToSearch: string = `${this.startPath}${file}`;
                this.log(pathToSearch);

                // Lecture des caractéristiques du fichier
                fs.lstat(pathToSearch, (err, stats) => {

                    if(err) {
                        return console.error(err);
                    }

                    const data: Archive.fileDescription = {
                        name: file,
                        isFile: stats.isFile(),
                        date: stats.birthtime
                    };

                    parametrage.push(data);
                    console.log(data);
                });

            });
        });

        return Promise.all(parametrage);
    };
}