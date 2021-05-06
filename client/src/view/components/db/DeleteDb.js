
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function DeleteDb({ onClick }) {
  const classes = useStyles();
   return (
    <div className={classes.root}>
      <IconButton aria-label="delete" onClick={onClick}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

