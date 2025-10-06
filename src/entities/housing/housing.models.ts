export interface Housing {
    id: string,
    owner: string, //TODO: A changer en objet
    address: string //TODO: A changer en objet
    surface: number,
    image: string,
}

export interface CreateHousingCmd {
    owner: string, //TODO: A changer en objet
    address: string //TODO: A changer en objet
    surface: number,
    images: string[],
}