import type { Housing } from "./housing.models";
import img from "../../assets/images.jpg"
import img2 from "../../assets/Carqueiranne.jpg"


export const mockHouses: Housing[] = [{
    name: "La parade - Aix",
    address: "La parade - Aix en provence",
    id: "1",
    image: img,
    owner: "Notarianni Chantal",
    surface: 32
}, {
    name: "B22 Carqueiranne",
    address: "Beau vézé - Carqueiranne",
    id: "2",
    image: img2,
    owner: "Sci Alexandre",
    surface: 49
}]