import type { Adress } from "./Adress.model";

export interface People {
  lastName: string;
  firstName: string;
  fullName?: string;
  adress?: Adress;
}
