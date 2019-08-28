import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SimpleSelect = (props) => {
  const classes = useStyles();
  const { csvFileNames, importFile } = props;
  const [values, setValues] = React.useState({
    fileName: csvFileNames[0],
    name: csvFileNames[0],
  });

  function handleChange(event) {
    importFile(event.target.value);

    setValues(oldValues => ({
      ...oldValues,
      fileName: event.target.value,
    }));
  }

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="csv-file-names">Datasets</InputLabel>
        <Select
          value={values.fileName}
          onChange={handleChange}
          inputProps={{
            name: 'csv-file-names',
            id: 'csv-file-names',
          }}
        >
        {csvFileNames.map((name, index) => {
             return <MenuItem key={index} value={name}>{name}</MenuItem>;
        })}
        </Select>
      </FormControl>
    </form>
  );
}

const mapStateToProps = ({ files }) => {
  return { files };
}

export default connect(mapStateToProps, actions)(SimpleSelect);