import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const FormDialog = (props) => {
    const [open, setOpen] = React.useState(props.open);
    const width = "lg";

    function handleClickOpen() {
      setOpen(true);
    }
  
    function handleClose() {
      setOpen(false);
    }
  
    return (
      <div>
        <Dialog fullWidth={true} open={open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
          {props.children}
        </Dialog>
      </div>
    );
}
  
export default FormDialog;