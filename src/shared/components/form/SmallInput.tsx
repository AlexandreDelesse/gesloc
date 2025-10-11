import { TextField, type TextFieldProps } from "@mui/material";

// interface Props {}

function SmallInput(props: TextFieldProps) {
  const {} = props;

  return <TextField size="small" {...props} />;
}

export default SmallInput;
