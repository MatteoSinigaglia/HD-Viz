import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
 
  chip: {
    margin: 2,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    maxWidth: 150,
    minWidth: 120,
  },
 
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Col 1',
  'Col 2',
  'Col 3',
  'Col 4',
  'Col 5',
];


export default function MultipleSelectColumns({ onChange, col }) {
  const classes = useStyles();
  
  return (
      <FormControl className={classes.formControl}>
      <InputLabel id="demo-mutiple-chip-label">Columns</InputLabel>
      <Select
        labelId="demo-mutiple-chip-label"
        id="demo-mutiple-chip"
        multiple
        value={col}
        onChange={onChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => <div className={classes.chips}>
            {selected.map(value => <Chip key={value} label={value} className={classes.chip} />)}
          </div>
        }
        MenuProps={MenuProps}
      >
        {names.map(name => <MenuItem key={name} value={name}> {name} </MenuItem>)}
      </Select>
    </FormControl>
  );
}