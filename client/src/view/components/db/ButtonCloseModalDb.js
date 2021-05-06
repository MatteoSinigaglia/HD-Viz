import CloseIcon from '@material-ui/icons/Close';
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

export default function ButtonCloseModalDb({onClick}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <IconButton aria-label="close" onClick={onClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}