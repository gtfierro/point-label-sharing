import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';
import { CSVLink } from "react-csv";
import SimpleSelect from './SimpleSelect';
import { getSorting, stableSort, removeMultipleIndices } from '../helper.js';

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, csvData, onColSelected, selectedCols } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  const headerRow = csvData && csvData.length > 0 ? csvData[0] : [];

  const header = headerRow.map(columnName => {

    return { 
      id: columnName,
      disablePadding: false,
      label: columnName
    };
  });

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>
        {header.map((row, index) => {
          return (<TableCell
            key={index}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === index ? order : false}
          >
            <TableSortLabel
              active={orderBy === index}
              direction={order}
              onClick={createSortHandler(index)}
            >
              {row.id}
              {orderBy === index ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
            { csvData.length > 1 ?
              <TableSortLabel
                  active={true}
                  direction='desc'
                  IconComponent={selectedCols[index] ? CheckCircleIcon : CheckCircleOutlineIcon}
                  onClick={event => onColSelected(index)}>
                  </TableSortLabel> : ""
            }
          </TableCell>)
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  const { numSelected, rows, handleDeleteClick, importFileFromDB } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            <SimpleSelect importFileFromDB={importFileFromDB} />
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteClick} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : ""}
        <CSVLink data={rows}>
          <Button variant="contained" color="primary">
            Download
          </Button>
        </CSVLink>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCellSelected: {
    backgroundColor: "#f7f7f7"
  }
}));

const EnhancedTable  = (props) => {
  const { csvData, csvName, importFileFromDB, onSelectedCol, fileId, updateFile } = props;
  let rows = csvData && csvData.length > 0 ? csvData.slice(1) : [];
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  let colMap = {};
  if (rows && rows.length > 0) {
    Object.keys(rows[0]).forEach((key, index) => {
      colMap[index] = false;
    });
  }
  
  const [selectedCols, setSelectedCols] = React.useState(colMap)
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, index) => index);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleCheckboxClick(event, selectedIndex) {

    let tempSelected = [...selected];
    const index = tempSelected.indexOf(selectedIndex);

    if (index === -1) {
      setSelected([...selected, selectedIndex]);
    } else {
      tempSelected.splice(index, 1);
      setSelected(tempSelected);
    }
  }

  async function handleDeleteClick(event) {

    rows = removeMultipleIndices(rows, selected);

    updateFile({
      fileId,
      contents: [csvData[0], ...rows]
    }).then(res => {
        importFileFromDB(res.files.file.fileid)
        setSelected([]);
    });
    
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  function handleColSelected(colIndex) {
    const newSelectedCols = { ...selectedCols, [colIndex]: !selectedCols[colIndex] }
    onSelectedCol(newSelectedCols);
    setSelectedCols(newSelectedCols);
  }

  const isSelected = index => selected.length > 0 && selected.includes(index);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  rows = stableSort(rows, getSorting(order, orderBy));

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar csvName={csvName} handleDeleteClick={handleDeleteClick} rows={rows} fileId={fileId} importFileFromDB={importFileFromDB} numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              csvData={csvData}
              onColSelected={handleColSelected}
              selectedCols={selectedCols}
            />
            <TableBody>
              {rows && rows.length > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;
                                    
                  return (
                    <TableRow
                      hover
                      onClick={event => handleCheckboxClick(event, index)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      { row.map((value, index) => {
                          return <TableCell key={index} className={selectedCols[index] ? classes.tableCellSelected : ""}>{value}</TableCell>;
                      })}
                    </TableRow>
                  );
                }) : (<TableRow>
                      <TableCell>
                        <Typography variant="h6">Choose dataset from dropdown.</Typography>
                      </TableCell>
                      </TableRow>)}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100, 200, 300]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
        />
    </div>
  );
}

export default EnhancedTable;