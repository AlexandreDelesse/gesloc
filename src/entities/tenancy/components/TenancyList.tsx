import { Divider, List, Typography } from "@mui/material";
import SimpleFlexCard from "../../../shared/components/containers/SimpleFlexCard";
import { getTenancyByHouse } from "../tenancy.repository";
import TenancyListItem from "./TenancyListItem";

interface Props {
  houseId: string;
}

function TenancyList(props: Props) {
  const { houseId } = props;

  const tenancies = getTenancyByHouse(houseId);
  const isLastIndex = (i: number) => i === tenancies.length - 1;
  const isListEmpty = tenancies.length < 1;

  return (
    <SimpleFlexCard title="Historique des locataires">
      {isListEmpty ? (
        <Typography my={3} textAlign={"center"}>
          Pas de locataire
        </Typography>
      ) : (
        <List>
          {tenancies.map((t, i) => (
            <div key={t.id}>
              <TenancyListItem tenancy={t} />
              {!isLastIndex(i) && (
                <Divider variant="inset" sx={{ bgcolor: "lightgrey" }} />
              )}
            </div>
          ))}
        </List>
      )}
    </SimpleFlexCard>
  );
}

export default TenancyList;
