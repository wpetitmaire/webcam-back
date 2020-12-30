import moment from 'moment';

export namespace Archive {

    // Objet en entrée du constructeur 
    interface initConfiguration {
        startPath: string;
        debugMode?: boolean;
        date?: moment.Moment
    }

    interface fileDescription {
        name: string,
        isFile: boolean,
        date: Date
    }
}
