import type { Tenancy } from "../tenancy.model";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreMenu from "./MoreMenu";

interface Props {
  tenancy: Tenancy;
}

function TenancyListItem(props: Props) {
  const { tenancy } = props;

  const tenancyDurationFormatted = `${tenancy.tenancyDuration} mois`;

  return (
    <ListItem secondaryAction={<MoreMenu />}>
      <ListItemAvatar>
        <Avatar>{tenancy.tenant[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={tenancy.tenant}
        secondary={
          <Typography>
            {new Date(tenancy.tenancyStartDate).toLocaleDateString("fr-FR", {
              dateStyle: "medium",
            })}{" "}
            ({tenancyDurationFormatted})
          </Typography>
        }
      />
    </ListItem>
  );
}

export default TenancyListItem;
