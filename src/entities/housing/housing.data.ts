import type { Housing } from "./housing.models";
import img from "../../assets/images.jpg";
import img2 from "../../assets/Carqueiranne.jpg";

export const mockHouses: Housing[] = [
  {
    name: "La parade - Aix",
    address: "La parade - Aix en provence",
    id: "1",
    image: img,
    owner: {
      firstName: "Chantal",
      lastName: "Notarianni",
      fullName: "Chantal NOTARIANNI",
      adress: {
        city: "Toulon",
        postCode: "83100",
        street: "rue Marius Touzet",
        number: 19,
      },
    },
    surface: 32,
  },
  {
    name: "B22 Carqueiranne",
    address: "Beau vézé - Carqueiranne",
    id: "2",
    image: img2,
    owner: {
      firstName: "Sci Alexandre",
      lastName: "",
      fullName: "Sci Alexandre",
      adress: {
        city: "La Valette du Var",
        postCode: "83160",
        street: "chemin Gabriel Ventre",
        number: 309,
      },
    },
    surface: 49,
  },
];
