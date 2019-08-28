
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SimpleTable from './SimpleTable';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    dense: {
      marginTop: theme.spacing(1),
      width: 100
    },
    menu: {
      width: 200,
    },
    margin: {
        margin: theme.spacing(1),
    }
  }));

const SplitDialogContent = (props) => {
    const { previewData, selectedCols, open, handleClose, title, createRule, applyRule  } = props;
    const classes = useStyles();

    const [delimeter, setDelimeter] = React.useState("");
    const [section, setSection] = React.useState(0);

    console.log(selectedCols);
    function handleApplyRule(e) {
        createRule({
            templateId: "split",
            data: {
                'cols': selectedCols,
                'args': [delimeter, section]
            }
        }).then(res => {
            applyRule({
                ruleId: res.rules.response.ruleid,
                fileId: "58063"
            }).then(() => {
                alert("DONE");
            });
        });

        console.log(delimeter, section);

        handleClose();

    }

    function handleDelimeterChange(e) {
        setDelimeter(e.target.value);
    }

    function handleSectionClicked(sectionIdx) {
        setSection(sectionIdx + 1);
    }
   
    return (

        <Dialog fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary">
                Split phrases by a chosen delimeter.
                </DialogContentText>
                <TextField
                    id="outlined-dense"
                    label="Delimeter"
                    className={clsx(classes.textField, classes.dense)}
                    margin="dense"
                    variant="outlined"
                    onChange={handleDelimeterChange}
                />
                <DialogContentText color="textPrimary" variant="subtitle1">
                    Chosen Section: {section}

                </DialogContentText>
                <DialogContentText color="textPrimary" variant="h6">
                    PREVIEW:

                </DialogContentText>
                
                { selectedCols.length > 0 ? <SimpleTable onSectionClicked={handleSectionClicked} delimeterAndSection={[delimeter, section]} previewData={previewData} /> : "First, choose the columns you would like to split."} 
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleApplyRule} color="primary">
                    Apply Rule
                </Button>
            </DialogActions>
        </Dialog>        
    );
}

export default connect(null, actions)(SplitDialogContent);