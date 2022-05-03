import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

type CheckboxInputType = {
  setDataFirst: (check: boolean) => void;
  setDataSecond: (check: boolean) => void;
  checkfirst: boolean;
  checksecond: boolean;
  labelfirst: string;
  labelsecond: string;
};

const CheckboxInput: React.FC<CheckboxInputType> = (props) => {
  function disableFirstHandler() {
    props.setDataFirst(!props.checkfirst);
  }
  function disableSecondHandler() {
    props.setDataSecond(!props.checksecond);
  }

  return (
    <FormGroup sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <FormControlLabel control={<Checkbox onChange={disableFirstHandler} checked={props.checkfirst} />} label={props.labelfirst} />
      <FormControlLabel control={<Checkbox onChange={disableSecondHandler} checked={props.checksecond} />} label={props.labelsecond} />
    </FormGroup>
  );
};

export default CheckboxInput;
