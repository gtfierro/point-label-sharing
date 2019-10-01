import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  }
}));

const StyledToggleButtonGroup = withStyles(theme => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    padding: theme.spacing(0, 1),
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

export default function SimpleTable(props) {
  const { previewData, trimRange, findAndReplaceWords, delimeterAndSection, onSectionClicked, wordToFind } = props;
  const [formats, setFormats] = React.useState(() => ['italic']);

  const classes = useStyles();

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };
  
  const columnNames = previewData[0];
  let rows = [];

  if (trimRange) {
    rows = previewData.slice(1).map(row => {
        return row.map(value => {
            return value.substring(trimRange[0], trimRange[1]);
        });
      });
  } else if (findAndReplaceWords) {
    rows = previewData.slice(1).map(row => {
      return row.map(value => {
          const re = new RegExp(escapeRegExp(findAndReplaceWords[0]), 'g');
          return value.replace(re, findAndReplaceWords[1]);
      });
    });
  } else if (delimeterAndSection) {
    rows = previewData.slice(1, 2).map(row => {
      return row.map(value => {
        if (delimeterAndSection[0]) {
          return value.split(delimeterAndSection[0]).join(" | ");
        } else {
          return value;
        }
      });
    });
  } else if (wordToFind) {
    rows = previewData.slice(1).map(row => {
      return row.map(value => {
          const re = new RegExp(escapeRegExp(wordToFind), 'g');
          return value.replace(re, "");
      });
    });
  } else {
    rows = previewData.slice(1);
  }

  function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
  }

  function handleSectionClick(e, sectionIdx) {
    onSectionClicked(sectionIdx);
  }
  
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {columnNames.map((columnName, index) => {
                return <TableCell key={index}>{columnName}</TableCell>;
            })}
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row, index) => {
                return (
                <TableRow key={index}>
                    {row.map((value,colIdx) => {
                      if (delimeterAndSection && delimeterAndSection[0]) {
                        return (
                          <TableCell key={colIdx} component="th" scope="row">
      
                            <StyledToggleButtonGroup
                            size="small"
                            value={formats}
                            onChange={handleFormat}
                            arial-label="text formatting">
                              {value.split(" | ").map((sectionValue, sectionIdx) => {
                                return <ToggleButton value={sectionValue} onClick={e => handleSectionClick(e, sectionIdx)} key={sectionIdx}>{sectionValue}</ToggleButton>;
                              })}
                            </StyledToggleButtonGroup>
                          </TableCell>);
                      } else {
                        return(
                            <TableCell key={colIdx} component="th" scope="row">
                              {value}
                            </TableCell>
                        );
                      }
                    })}
                </TableRow>);
            })}
            <TableRow>
                <TableCell component="th" scope="row">...</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}