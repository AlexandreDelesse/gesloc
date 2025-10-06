import type { Tenancy } from "../tenancy.model";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  tenancy: Tenancy;
}

function TenancyListItem(props: Props) {
  const { tenancy } = props;

  const tenancyDurationFormatted = `${tenancy.tenancyDuration} mois`;

  const handleActionClick = () => alert("Ce bouton ne fait rien !");

  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={handleActionClick}>
          <MoreVertIcon sx={{ color: "whitesmoke" }} />
        </IconButton>
      }
    >
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
