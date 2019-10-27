
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
import Switch from '@material-ui/core/Switch';
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
    const { previewData, selectedCols, open, handleClose, title, createRule, applyRule, fileId, importFileFromDB, handleAddRule  } = props;
    const classes = useStyles();

    const [delimeter, setDelimeter] = React.useState("");
    const [sections, setSections] = React.useState([]);

    const [keepDelimeter, setKeepDelimeter] = React.useState(false);
    
    const handleChange = event => {
        setKeepDelimeter(event.target.checked);
    };

    function handleApplyRule(e) {
        createRule({
            templateId: "split",
            data: {
                'cols': selectedCols,
                'args': [delimeter, keepDelimeter, sections]
            }
        }).then(res => {
            const ruleData = {
                ruleid: res.rules.response.ruleid,
                template: "split"
            };

            console.log(ruleData);

            handleAddRule(ruleData);

            applyRule({
                ruleId: res.rules.response.ruleid,
                fileId
            }).then(res => {
                importFileFromDB(res.rules.response.fileid);
            });
        });

        handleClose();

    }

    function handleDelimeterChange(e) {
        setDelimeter(e.target.value);
    }

    function handleSectionsClicked(sections) {
        setSections(sections);
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
                <DialogContentText color="textPrimary">
                Keep delimeter
                </DialogContentText>
                <Switch
                    checked={keepDelimeter}
                    onChange={handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <DialogContentText color="textPrimary" variant="subtitle1">
                    Chosen Sections: {sections.join(", ")}

                </DialogContentText>
                <DialogContentText color="textPrimary" variant="h6">
                    PREVIEW:

                </DialogContentText>
                
                { selectedCols.length > 0 ? <SimpleTable onSectionsClicked={handleSectionsClicked} delimeterAndSections={[delimeter, sections]} previewData={previewData} /> : "First, choose the columns you would like to split."} 
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