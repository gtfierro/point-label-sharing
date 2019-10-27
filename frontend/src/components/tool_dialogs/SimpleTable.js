import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
  const { previewData, trimRange, findAndReplaceWords, delimeterAndSections, onSectionsClicked, wordToFind } = props;
  const [sections, setSections] = React.useState(() => []);

  const classes = useStyles();

  const handleSectionsClicked = (event, newSections) => {
    setSections(newSections);
    onSectionsClicked(newSections);
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
  } else if (delimeterAndSections) {
    rows = previewData.slice(1, 2).map(row => {
      return row.map(value => {
        if (delimeterAndSections[0]) {
          return value.split(delimeterAndSections[0]).join(" | ");
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
                      if (delimeterAndSections && delimeterAndSections[0]) {
                        return (
                          <TableCell key={colIdx} component="th" scope="row">
      
                            <StyledToggleButtonGroup
                            size="small"
                            value={sections}
                            onChange={handleSectionsClicked}
                            arial-label="split text">
                              {value.split(" | ").map((sectionValue, sectionIdx) => {
                                return <ToggleButton value={sectionIdx + 1} key={sectionIdx}>{sectionValue}</ToggleButton>;
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