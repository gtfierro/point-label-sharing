import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
    padding: 20
  },
  slider: {
    marginTop: 40
  }
});

function valuetext(value) {
  return `${value} chars`;
}

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([props.minValue, props.maxValue]);
  const { onSliderChange } = props;
  const handleChange = (event, newValue) => {
    onSliderChange(newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom>
        {props.label}
      </Typography>
      <Slider
        max={props.maxValue}
        min={props.minValue}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="on"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
        className={classes.slider}
      />
    </div>
  );
}