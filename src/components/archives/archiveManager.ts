import { Archive } from './archive';
const config = require('config');
import jsdom from "jsdom";
import got from 'got';
import { log } from 'console';
import moment from 'moment';
moment().format();
const { JSDOM } = jsdom;

const enum typesOfSearching { all, year, month, day };
class ArchiveManager {

    private readonly startPath = `http://${config.get('webcam.host')}:${config.get('webcam.archives.port')}${config.get('webcam.archives.basePath')}` ;
    private startPoint = typesOfSearching.all;
    private year!: number | undefined;
    private month!: number | undefined;
    private day!: number | undefined;

    constructor(parameters?: Archive.initConfiguration) {
        
        if(!parameters)
            return;

        this.year = parameters.year;
        this.month = parameters.month;
        this.day = parameters.day;

        if(this.year && this.month && this.day)
            this.startPoint = typesOfSearching.day;
        else if(this.year && this.month)
            this.startPoint = typesOfSearching.month;
        else if(this.year)
            this.startPoint = typesOfSearching.year;
    };

    /**
     * Construit le chemin ou récupérer les éléments des archives
     */
    private getPathToSearch(): string {

        switch(this.startPoint) {

            case typesOfSearching.all:
                return `${this.startPath}/`;

            case typesOfSearching.day:

                if(this.year && this.month && this.day) {

                    let day = (this.day < 10) ? `0${this.day}` : `${this.day}`;
                    let month = (this.month < 10) ? `0${this.month}` : `${this.month}`;

                    return `${this.startPath}/${this.year}/${month}/${day}/`;
                }

            case typesOfSearching.year:
                if(this.year)
                    return `${this.startPath}/${this.year}/`; 

            case typesOfSearching.month:
                
                if(this.year && this.month) {

                    let month = (this.month < 10) ? `0${this.month}` : `${this.month}`;
                    return `${this.startPath}/${this.year}/${month}/`;
                }
                break;

            default:
                return '';
        }

        return '';
    }

    /**
     * Récupérer le "scrapping" de la page du Raspberry affichant les éléments de la page demandée.
     */
    getNodesInformationFromRaspberry(): Promise<HTMLTableRowElement[]> {
        log("--ArchiveManager.getNodesInformationFromRaspberry--");

        return new Promise((success, fail) => {

            // Récupération des informations venant de la page web du Raspberry
            got(this.getPathToSearch())
                // Tout va bien...
                .then((response) => {

                    const dom = new JSDOM(response.body);

                    // Récupération de toutes les lignes du tableau affichées par la page web
                    const nodeList = [...dom.window.document.querySelectorAll('tr')]

                        // On ne garde que les lignes qui ont des cellules (on enlèves la ligne de titre)
                        .filter((node) => {
                            return node.querySelector('td');
                        })

                        // On enlève la ligne contenant le lien pour retourner au dossier parent
                        .filter((node) => {
                            return !node.querySelector('img[alt="[PARENTDIR]"]')
                        })

                        // On enlève la ligne avec le lien vers la dernière capture
                        .filter((node) => {
                            return !node.querySelector('a[href="lastsnap.jpg"]')
                        });

                    // On retourne la liste filtrée contenant uniquement les lignes des élements contenu dans le dossier
                    success(nodeList);
                })
                // Rien ne va plus ... On retourne le message d'erreur
                .catch((e) => fail(e));
        });
    }
  
    /**
     * Renvoie la description des éléments présents dans le dossier
     */
    getDataDescription(): Promise<Archive.fileDescription[]> {
        log("--ArchiveManager.getDataDescription--");

        return new Promise((success, fail) => {

            let dataList: Archive.fileDescription[] = [];
            
            this.getNodesInformationFromRaspberry().then((result) => {

                result.forEach(rowElement => {

                    // const name = rowElement.querySelector('a')?.innerHTML.split('/')[0] || "";
                    const isFile = rowElement.querySelector('img[alt="[DIR]"]') === null;
                    const stringDate = [...rowElement.querySelectorAll('td')][2].innerHTML;
                    const date = moment(stringDate, 'YYYY-MM-DD HH:mm');
                    const absolutePath = this.getPathToSearch() + rowElement.querySelector('a')?.innerHTML;
                    const name = isFile ? moment(stringDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY') : rowElement.querySelector('a')?.innerHTML.split('/')[0] || ""; 

                    dataList.push({ name, isFile, date, absolutePath });
                })

                success(dataList);
            })
            .catch(e => fail(e));

        });
    }; 
}
 
export {ArchiveManager};