import { mockHouses } from "./housing.data"

export const getHouses = () => {
    return mockHouses
}

export const getHouseById = (id: string) => {
    return mockHouses.find(h => h.id == id)
}