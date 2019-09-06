
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RangeSlider from './RangeSlider';
import SimpleTable from './SimpleTable';
import { connect } from 'react-redux';
import * as actions from '../../actions';

const TrimDialogContent = (props) => {
    const { previewData, selectedCols, open, handleClose, title, handleAddRule, createRule, updateRule, applyMultipleRules, applyRule, fileId, importFileFromDB, existingData } = props;

    let lengths = [];

    previewData.slice(1).forEach(row => {
        row.forEach(val => {
            lengths.push(val.length);
        });
    });

    const maxSliderValue = previewData.length > 0 ? Math.max(...lengths) : 50;

    let existingTrimRange = 0;

    if (existingData) {
        existingTrimRange = [existingData[0], existingData[1]];
    }
    const [trimRange, setTrimRange] = React.useState(existingTrimRange);

    function onSliderChange(range) {
        setTrimRange(range);
    }

    function handleApplyRule(e) {
        if (existingData) {
            updateRule({
                'templateId': "trim",
                'ruleId': existingData.ruleId,
                'fileId': fileId,
                'data': {
                    'cols': selectedCols,
                    'args': [trimRange[0], maxSliderValue - trimRange[1]]
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
                templateId: "trim",
                data: {
                    'cols': selectedCols,
                    'args': [trimRange[0], maxSliderValue - trimRange[1]]
                }
            }).then(res => {
                const ruleData = {
                    ruleid: res.rules.response.ruleid,
                    template: "trim"
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
                    { selectedCols.length > 0 ? <SimpleTable trimRange={trimRange} previewData={previewData} /> : "First, choose the columns you would like to trim characters."} 
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
                Trim the first n characters from the left and right using the slider.
                </DialogContentText>
                <RangeSlider minValue={0} maxValue={maxSliderValue} defaultValue={trimRange} onSliderChange={onSliderChange} />
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

const mapStateToProps = ({ rules }) => {
    return { rules };
}
  
export default connect(mapStateToProps, actions)(TrimDialogContent);