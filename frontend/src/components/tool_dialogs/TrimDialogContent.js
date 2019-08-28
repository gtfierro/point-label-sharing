
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
    const { previewData, selectedCols, open, handleClose, title, handleAddRule, createRule, applyRule } = props;
    const [trimRange, setTrimRange] = React.useState(0);

    const maxSliderValue = selectedCols.length > 0 ? Math.max(previewData[1][0].length, previewData[2][0].length) : 50;
    console.log(previewData);

    function onSliderChange(range) {
        setTrimRange(range);
    }

    function handleApplyRule(e) {
        createRule({
            templateId: "trim",
            data: {
                'cols': selectedCols,
                'args': [trimRange[0], maxSliderValue - trimRange[1]]
            }
        }).then(res => {
            applyRule({
                ruleId: res.rules.response.ruleid,
                fileId: "58063"
            }).then(() => {
                
            });
        });

        handleClose();
        handleAddRule();
    }

    return (

        <Dialog fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText color="textPrimary">
                Trim the first n characters from the left and right using the slider.
                </DialogContentText>
                <RangeSlider minValue={0} maxValue={maxSliderValue} onSliderChange={onSliderChange} />
                <DialogContentText color="textPrimary" variant="h6">
                    PREVIEW:

                </DialogContentText>
                { selectedCols.length > 0 ? <SimpleTable trimRange={trimRange} previewData={previewData} /> : "First, choose the columns you would like to trim."} 
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

const mapStateToProps = ({ rules }) => {
    return { rules };
}
  
export default connect(mapStateToProps, actions)(TrimDialogContent);