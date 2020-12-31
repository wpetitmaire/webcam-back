import moment from 'moment';

export namespace Archive {

    // Objet en entrée du constructeur 
    interface initConfiguration {
        debugMode?: boolean | false,
        date?: moment.Moment,
        year?: number,
    }

    // interface initConfigurationWithYear {
    //     year: number,
    //     debugMode?: boolean | false,
    // }

    interface fileDescription {
        name: string,
        isFile: boolean,
        date: Date
    }
}
