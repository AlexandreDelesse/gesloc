import { tenancies } from "./tenancy.data";

export const getTenancyByHouse = (houseId: string) => {
  return tenancies.filter((t) => t.house.id == houseId);
};

export const getCurrentTenancyByHouse = (houseId: string) => {
  const tenancies = getTenancyByHouse(houseId);
  if (!tenancies.length) return undefined;
  const today = new Date();
  return tenancies.find((t) => {
    const start = new Date(t.tenancyStartDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + t.tenancyDuration);
    return today >= start && today <= end;
  });
};
