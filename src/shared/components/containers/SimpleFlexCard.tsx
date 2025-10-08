import { Box, Typography } from "@mui/material";
import { type ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

function SimpleFlexCard(props: Props) {
  const { children, title } = props;

  return (
    <Box flex={1} bgcolor="#333" p={2} borderRadius={2}>
      {title && <Typography variant="h6">{title}</Typography>}
      {children}
    </Box>
  );
}

export default SimpleFlexCard;
