import React from 'react';
import clsx from 'clsx';
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
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import FilterListIcon from '@material-ui/icons/FilterList';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SendIcon from '@material-ui/icons/Send';
import Tooltip from '@material-ui/core/Tooltip';
import { TrimDialogContent, ReplaceDialogContent, SplitDialogContent, RegexDialogContent, RemoveDialogContent, FilterDialogContent } from  "./Dialogs";
import EnhancedTable from './EnhancedTable';

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
  const iconList = [<StrikethroughSIcon />, <FindReplaceIcon />, <HorizontalSplitIcon />, <LinearScaleIcon />, <RemoveCircleIcon />, <FilterListIcon />];
  const [selectedCols, setSelectedCols] = React.useState([]);
  const [appliedRule, setAppliedRule] = React.useState(false);
  const { csvData, csvName, importFile, appliedRules } = props;

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function sliceData(data, rows, cols) {
    let result = [];
    let headerRow = [];
    rows.forEach(rowIdx => {
      let row = [];
      cols.forEach(colIdx => {
        const colName = Object.keys(data[0])[colIdx];
        if (!headerRow.includes(colName)) {
          headerRow.push(colName);
        }
        row.push(data[rowIdx][colName]);
      });
      result.push(row);
    });
    result.unshift(headerRow);
    return result;
  }

  function renderDialogByAction() {

    console.log(action);

    const previewData = sliceData(csvData, [0, 1], selectedCols);

    switch(action) {
      case "Trim":
        return <TrimDialogContent open={true} title={action} handleClose={() => setAction("")} handleAddRule={() => setAppliedRule(true)} selectedCols={selectedCols} previewData={previewData} />;
      case "Find and Replace":
        return <ReplaceDialogContent open={true} title={action} handleClose={() => setAction("")} handleAddRule={(action) => alert(action)} selectedCols={selectedCols} previewData={previewData} />;
      case "Split":
        return <SplitDialogContent open={true} title={action} handleClose={() => setAction("")} handleAddRule={(action) => alert(action)} selectedCols={selectedCols} previewData={previewData} />;
      case "Regex":
        return <RegexDialogContent open={true} title={action} handleClose={() => setAction("")} handleAddRule={(action) => alert(action)} selectedCols={selectedCols} previewData={previewData} />;
      case "Remove":
        return <RemoveDialogContent open={true} title={action} handleClose={() => setAction("")} handleAddRule={(action) => alert(action)} selectedCols={selectedCols} previewData={previewData} />;
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
            onClick={handleDrawerOpen}
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {["Trim", "Find and Replace", "Split", "Regex", "Remove"].map((action, index) => (
            <Tooltip key={index} title={action} placement="right">
              <ListItem button onClick={() => setAction(action)} key={index}>
                <ListItemIcon>{iconList[index]}</ListItemIcon>
                <ListItemText primary={action} />
              </ListItem>
            </Tooltip>
          ), this)}
        </List>
        <Divider />
        <List>
          {['Download', "Submit"].map((action, index) => (
            <Tooltip key={index} title={action} placement="right">
              <ListItem button key={action}>
                <ListItemIcon>{index % 2 === 0 ? <CloudDownloadIcon /> : <SendIcon />}</ListItemIcon>
                <ListItemText primary={action} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Divider />
        <List>
          {appliedRules.map((rule, index) => (
            <Tooltip key={index} title={action} placement="right">
              <ListItem button key={action}>
                <ListItemIcon>{index % 2 === 0 ? <CloudDownloadIcon /> : <SendIcon />}</ListItemIcon>
                <ListItemText primary={rule.template} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <EnhancedTable csvData={csvData} csvName={csvName} importFile={importFile} onSelectedCol={handleSelectedCol} />
      </main>
    </div>
  );


}

export default MiniDrawer;