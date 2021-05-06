import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import React from 'react';


const ColorButton = withStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: purple[700],
    },
    backgroundColor: purple[500],
    color: theme.palette.getContrastText(purple[500]),
  },
}))(Button);

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));


export default function ButtonConfirm({ onClick, disabled }) {
  const classes = useStyles();

  return (
    <div id="button">
      <ColorButton variant="contained" color="primary" className={classes.margin} onClick={onClick} disabled={disabled}>
        Invia Dati
      </ColorButton>
    </div>
  );
}

