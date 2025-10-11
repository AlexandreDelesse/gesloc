import type {  Property } from "../../property/property.model";
import { getCurrentTenancyByHouse } from "../tenancy.repository";
import SimpleFlexCard from "../../../shared/components/containers/SimpleFlexCard";
import { Typography } from "@mui/material";
import TenancyListItem from "./TenancyListItem";

interface Props {
  property: Property;
}

function CurrentTenancy(props: Props) {
  const { property } = props;

  const currentTenancy = getCurrentTenancyByHouse(property.id);

  const content = currentTenancy ? (
    <TenancyListItem tenancy={currentTenancy} />
  ) : (
    <Typography my={2} textAlign="center">
      Aucun bail en cours
    </Typography>
  );

  return <SimpleFlexCard title="Bail en cours">{content}</SimpleFlexCard>;
}

export default CurrentTenancy;
