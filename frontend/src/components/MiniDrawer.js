import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import { TrimDialogContent, ReplaceDialogContent, SplitDialogContent, RegexDialogContent, RemoveDialogContent } from  "./Dialogs";
import EnhancedTable from './EnhancedTable';
import { sliceData } from '../helper';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const MiniDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [action, setAction] = React.useState("");
  const iconList = {
    "trim": <StrikethroughSIcon />, 
    "find and replace": <FindReplaceIcon />, 
    "split": <HorizontalSplitIcon />,
    "regex": <LinearScaleIcon />,
    "remove": <RemoveCircleIcon />
  };
  const [selectedCols, setSelectedCols] = React.useState([]);
  const [existingDialogData, setExistingDialogData] = React.useState(null);
  const [previewData, setPreviewData] = React.useState([]);
  const { csvData, csvName, importFileFromDB, appliedRules, fileId, deleteRule, applyMultipleRules, getRule, uploadFile, updateFile } = props;
  const [rules, setRules] = React.useState(appliedRules);

  function renderDialogByAction() {

    switch(action) {
      
      case "Trim":
        return <TrimDialogContent existingData={existingDialogData} importFileFromDB={importFileFromDB} fileId={fileId} open={true} title={action} handleClose={() => setAction("")} handleAddRule={(rule) => setRules([...rules, rule])} selectedCols={selectedCols} previewData={previewData} />;
      case "Find and Replace":
        return <ReplaceDialogContent existingData={existingDialogData} importFileFromDB={importFileFromDB} fileId={fileId} open={true} title={action} handleClose={() => setAction("")} handleAddRule={(rule) => setRules([...rules, rule])} selectedCols={selectedCols} previewData={previewData} />;
      case "Split":
        return <SplitDialogContent existingData={existingDialogData} importFileFromDB={importFileFromDB} fileId={fileId} open={true} title={action} handleClose={() => setAction("")} handleAddRule={(rule) => setRules([...rules, rule])} selectedCols={selectedCols} previewData={previewData} />;
      case "Regex":
        return <RegexDialogContent existingData={existingDialogData} importFileFromDB={importFileFromDB} fileId={fileId} open={true} title={action} handleClose={() => setAction("")} handleAddRule={(rule) => setRules([...rules, rule])} selectedCols={selectedCols} previewData={previewData} />;
      case "Remove":
        return <RemoveDialogContent existingData={existingDialogData} importFileFromDB={importFileFromDB} fileId={fileId} open={true} title={action} handleClose={() => setAction("")} handleAddRule={(rule) => setRules([...rules, rule])} selectedCols={selectedCols} previewData={previewData} />;
      default:
        return "";
    }
  }

  function handleSelectedCol(colsSelected) {
    var selectedIndexes = [];
    Object.keys(colsSelected).forEach(key => {
      if (colsSelected[key]) {
        selectedIndexes.push(parseInt(key));
      }
    });

    setSelectedCols(selectedIndexes);
  }

  function handleEditRule(ruleId, action) {
    getRule({
      ruleId
    }).then(res => {
      if (action === "Find and replace") {
        setExistingDialogData({ ...res.rules.rule.args, ruleId });
        setAction("Find and Replace");
      } else {
        setExistingDialogData({ ...res.rules.rule.args, ruleId });
        setAction(action);
      }

    });

  
  }

  function handleDeleteRule(ruleId) {

    deleteRule({
      fileId,
      ruleId
    }).then(res => {
      applyMultipleRules({
        ruleIds: res.rules.ruleIds,
        fileId: res.rules.originalFile
      }).then(({ rules }) => {
        importFileFromDB(rules.response.fileId)
      })
    })
  }

  function openDialog(action, selectedCols) {
    console.log(csvData);
    setPreviewData(sliceData(csvData, [0, 1, 2], selectedCols));
    setExistingDialogData(null);
    setAction(action);
  }

  function handleCapture({ target }) {
   
    uploadFile(target.files[0]);

  }

  return (
    <div className={classes.root}>
      {renderDialogByAction()}
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Edit Building Datasets
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <h3>TOOLS</h3>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Trim", "Find and Replace", "Split", "Regex", "Remove"].map((action, index) => (
            <Tooltip key={index} title={action} placement="right">
              <ListItem button onClick={() => openDialog(action, selectedCols, null)} key={index}>
                <ListItemIcon>{iconList[action.toLowerCase()]}</ListItemIcon>
                <ListItemText primary={action} />
              </ListItem>
            </Tooltip>
          ), this)}
          <Tooltip key={5} title={"Upload"} placement="right">
              <ListItem button key={5}>
                <ListItemIcon>{<CloudUploadIcon />}</ListItemIcon>
                <ListItemText primary={"Upload"} />
                <input
                    accept=".csv"
                    className={classes.input}
                    id="csv-upload-button"
                    onChange={handleCapture}
                    type="file"
                    style={{opacity: 0, cursor: "pointer"}}
                />
              </ListItem>
          </Tooltip>
        </List>
        <Divider />
        <List>
           <h3>APPLIED RULES</h3>
          {appliedRules.length > 0 ? appliedRules.map((rule, index) => (
            <Tooltip key={index} title={action} placement="right">
              <ListItem button key={rule.ruleid}>
                <ListItemIcon>{iconList[rule.template]}</ListItemIcon>
                <ListItemText primary={rule.template === "find and replace" ? "Replace" : rule.template.charAt(0).toUpperCase() + rule.template.slice(1)} />
                <IconButton size="small" color="secondary" onClick={() => handleDeleteRule(rule.ruleid)} aria-label="delete"><DeleteIcon/></IconButton>
                { !(rule.template === "split") ? <IconButton size="small" color="primary" onClick={() => handleEditRule(rule.ruleid, rule.template.charAt(0).toUpperCase() + rule.template.slice(1))} aria-label="edit"><EditIcon/></IconButton> : ""}
              </ListItem>
            </Tooltip>
          )) : "No rules applied"}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <EnhancedTable csvData={csvData} csvName={csvName} fileId={fileId} updateFile={updateFile} importFileFromDB={importFileFromDB} onSelectedCol={handleSelectedCol} />
      </main>
    </div>
  );


}

export default connect(null, actions)(MiniDrawer);