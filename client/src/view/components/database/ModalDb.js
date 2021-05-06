import React, {useCallback, useEffect, } from 'react';
import { action } from 'mobx';
import ButtonCloseModalDb from './ButtonCloseModalDb';
import ButtonConfirmDb from './ButtonConfirmDb';
import DbButton from './DbButton'; 
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import SelectVizColumns from './SelectVizColumns';
import SelectVizTable from './SelectVizTable';

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    position: 'absolute'
  },
}));

export default function ModalDb() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [table, setTable] = React.useState(''); 
  const [sent, sentDb] = React.useState([]); 

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  } 

  const onChangeColumnsDb = e => {
    setColumns(e.target.value);
  };

  const onChangeTableDb = e => {
    setTable(e.target.value);
  }
  
  const optionsSelected = useCallback(
    () => {
      let select; 
      select = columns !== [];
      select = select && table !== "";  
      sentDb(select);
    },
    [columns, table]
    );  
  
    useEffect(() => {
      optionsSelected();
    }, [optionsSelected]); 

    const onClickSent = action(() => {
      let formData = {
        columns,
        table 
      }; 
      formData.table = table; 
      formData.columns = columns; 
      onClose();
    });
  
  const body = 
  <div className={classes.paper}>
      <ButtonCloseModalDb onClick={onClose}/> 
      <div id="description">
        <SelectVizTable onChange={onChangeTableDb} tab={table}/>
        <SelectVizColumns onChange={onChangeColumnsDb} col={columns}/> 
        <ButtonConfirmDb onClick={onClickSent} disabled={!sent} />
      </div>   
    </div>
  

  return (
    <div >
      <div id="DbButton">
        <DbButton onClick={onOpen}/>
      </div> 
      <Modal 
        open={open}
        aria-labelledby="title"
        aria-describedby="description"
      >
        {body}
      </Modal>
    </div>
  );
}