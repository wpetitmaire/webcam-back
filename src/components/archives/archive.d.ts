export namespace Archive {

    // Objet en entrée du constructeur 
    interface initConfiguration {
        startPath: string;
    }

    interface fileDescription {
        name: string,
        isFile: boolean,
        date: Date
    }
}
