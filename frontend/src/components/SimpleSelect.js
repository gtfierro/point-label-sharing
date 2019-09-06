import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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
  const { importFileFromDB, getAllFiles, files } = props;

  if (!files.files) {
    getAllFiles({
      appliedRules: true
    });
  }

  let fileName = "";
  
  if (files.files && Object.keys(files.files).length > 0) {
    fileName = files.files[Object.keys(files.files)[0]]["name"];
  }
 
  const [values, setValues] = React.useState({
    fileName
  });

  if (!files || !files.files) {
    return <div></div>;
  }

  function handleChange(event) {
    importFileFromDB(event.target.value);

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
        {Object.keys(files.files).map((fileId, index) => {
             return <MenuItem key={index} value={fileId}>{files.files[fileId]["name"]}</MenuItem>;
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