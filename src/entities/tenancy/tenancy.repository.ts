import { tenancies } from "./tenancy.data"

export const getTenancyByHouse = (houseId: string) => {
    return tenancies.filter(t => t.house.id == houseId)
}