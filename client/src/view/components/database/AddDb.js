/* eslint-disable no-underscore-dangle */
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import React from 'react';

const useStyles = makeStyles(theme => ({
  input: {
    display: 'none',
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));

const ColorButton = withStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: purple[700],
    },
    backgroundColor: purple[500],
    color: theme.palette.getContrastText(purple[500])
  },
}))(Button);

const Dataset = ({ fileName, onChange, onChangeTableName}) => {
  const classes = useStyles();

  return (
    <div className={classes.root} id="insertdataset">
      <input
        accept=".csv, .json, .tsv"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={onChange}
      />

      <input  
        type="text"
        onChange={onChangeTableName}
      />

      <label htmlFor="contained-button-file">
        <ColorButton variant="contained" color="primary" component="span" >
          {fileName === undefined ? "Aggiungi Dataset" : fileName}
        </ColorButton>
      </label>
    </div>
  );
};

export default Dataset;