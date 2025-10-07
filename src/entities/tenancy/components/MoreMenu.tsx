import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, type MouseEvent } from "react";
import { PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import QuittancePDF from "../pdfTemplates/QuittancePDF";

interface Props {}

function MoreMenu(props: Props) {
  const {} = props;
  const doc = usePDF({ document: <QuittancePDF /> });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOnClick}>
        <MoreVertIcon sx={{ color: "whitesmoke" }} />
      </IconButton>

      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        onClose={handleOnClose}
      >
        <MenuItem>
          <PDFDownloadLink style={{ all: "unset" }} document={<QuittancePDF />}>
            Télécharger quittance
          </PDFDownloadLink>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MoreMenu;
