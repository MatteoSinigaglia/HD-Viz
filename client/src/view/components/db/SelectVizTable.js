import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({onChange, tab}) {
  const classes = useStyles();

  return (
    <div>
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Tabelle</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tab}
          onChange={onChange}
        >
          <MenuItem value={'tab1'}>Tab1</MenuItem>
          <MenuItem value={'tab2'}>Tab2</MenuItem>
          <MenuItem value={'tab3'}>Tab3</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
