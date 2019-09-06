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
      marginBottom: theme.spacing(2)
    },
    dense: {
      marginTop: theme.spacing(1),
    },
    menu: {
      width: 200,
    },
    margin: {
        margin: theme.spacing(1),
    }
  }));

const RemoveDialogContent = (props) => {
    const { previewData, selectedCols, open, handleClose, title, createRule,  handleAddRule, applyRule, applyMultipleRules, updateRule, fileId, importFileFromDB, existingData  } = props;
    const classes = useStyles();

    let existingWordToFind = "";

    if (existingData) {
        existingWordToFind = existingData[0];
    }

    const [wordToFind, setWordToFind] = React.useState(existingWordToFind);

    function handleApplyRule(e) {
        if (existingData) {
            updateRule({
                'templateId': "remove",
                'ruleId': existingData.ruleId,
                'fileId': fileId,
                'data': {
                    'cols': selectedCols,
                    'args': [wordToFind]
                }
            }).then(res => {
                applyMultipleRules({
                    ruleIds: res.rules.ruleIds,
                    fileId: res.rules.originalFile
                }).then(({ rules }) => {
                    importFileFromDB(rules.response.fileId);
                });
            });
        } else {
            createRule({
                templateId: "remove",
                data: {
                    'cols': selectedCols,
                    'args': [wordToFind]
                }
            }).then(res => {
                const ruleData = {
                    ruleid: res.rules.response.ruleid,
                    template: "remove"
                };

                handleAddRule(ruleData);

                applyRule({
                    ruleId: res.rules.response.ruleid,
                    fileId
                }).then(res => {
                    importFileFromDB(res.rules.response.fileid);
                });
            });
        }

        handleClose();

    }

    function renderPreview() {
        if (!existingData) {
            return (
                <div>
                    <DialogContentText color="textPrimary" variant="h6">
                    PREVIEW:

                    </DialogContentText>
                    { selectedCols.length > 0 ? <SimpleTable wordToFind={wordToFind} previewData={previewData} /> : "First, choose the columns you would like to remove characters."} 
                </div>
            );
        }

        return "";
    }
   
    return (

        <Dialog fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary">
                Remove all occurrences of the specified phrases.
                </DialogContentText>
                <form className={classes.container} noValidate autoComplete="off">
                    <div>
                        <TextField
                            id="outlined-dense"
                            label="Find"
                            className={clsx(classes.textField, classes.dense)}
                            margin="dense"
                            variant="outlined"
                            value={wordToFind}
                            onChange={(e) => setWordToFind(e.target.value)}
                        />
                    </div>
                </form>
                {renderPreview()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleApplyRule} color="primary">
                    { existingData ? "Update Rule" : "Apply Rule" }
                </Button>
            </DialogActions>
        </Dialog>        
    );
}

export default connect(null, actions)(RemoveDialogContent);