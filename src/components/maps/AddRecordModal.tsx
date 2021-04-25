import { useMutation } from '@apollo/client';
import { Box, Button, createStyles, Input, makeStyles, Modal, Theme } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import React, { useContext, useState } from 'react';
import { CreateRecordResponse, CREATE_RECORD } from 'src/lib/graphql/record';
import useInputs from 'src/lib/hooks/useInputs';
import { firebaseAuth } from 'src/lib/provider/AuthProvider';
import { formatDate } from 'src/lib';
import { useHistory } from 'react-router';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top : `${top}%`,
    left : `${left}%`,
    transform : `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    spacer : {
      flexGrow : 1
    },
    modal : {
      position : 'absolute'
    },
    modalCard : {
      display : 'flex',
      flexDirection : 'column',
      backgroundColor : '#fff',
      padding : '16px',
      borderRadius : '8px',
      minWidth : '320px'
    },
    inputBox : {
      margin : '8px 16px'
    },
    input : {
      width : '100%'
    },
    bottom : {
      margin : '8px',
      display : 'flex'
    }
  })
);

interface Props {
  open: boolean;
  coordinate: number[];
  handleClose: () => void;
}

function AddRecordModal({ open, handleClose, coordinate }: Props) {
  const [modalStyle] = useState(getModalStyle);
  const history = useHistory();
  const [selectedDate, handleDateChange] = useState(new Date());
  const { user } = useContext(firebaseAuth);
  const [createRecord] = useMutation<CreateRecordResponse>(CREATE_RECORD);
  const [form, onChange] = useInputs({
    title : '',
    content : ''
  });

  function handleSave() {
    if (user) {
      createRecord({
        variables : {
          title : form.title,
          content : form.content,
          date : formatDate(selectedDate),
          coordinate : coordinate,
          userId : user.uid
        }
      });
    } else {
      alert('로그인이 필요합니다.');
      history.push('/login');
    }
    handleClose();
  }
  
  const classes = useStyles();
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={modalStyle} className={classes.modal}>
        <div className={classes.modalCard}>
            
          <Box className={classes.inputBox}>
            <Input value={form.title} onChange={onChange} name="title" className={classes.input} placeholder="title"/>
          </Box>
          <Box className={classes.inputBox}>
            <Input value={form.content} onChange={onChange} name="content" className={classes.input} placeholder="description"/>
          </Box>
          <Box className={classes.inputBox}>
            <DatePicker
              autoOk
              className={classes.input}
              clearable
              disableFuture
              value={selectedDate}
              onChange={(date) => handleDateChange(date as Date)}
            />
          </Box>
          <div className={classes.spacer} />
          <div className={classes.bottom}>
            <div className={classes.spacer} />
            <Box mx={1}>
              <Button size="small" variant="contained" color="secondary" onClick={handleSave}>
        저장
              </Button>
            </Box>
            <Box mx={1}>

              <Button size="small" variant="contained" color="default" onClick={handleClose} >
        닫기
              </Button>
            </Box>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddRecordModal;