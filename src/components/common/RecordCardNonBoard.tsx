import { useMutation } from '@apollo/client';
import { Box, IconButton, Menu, MenuItem, Typography, Paper, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { Spacer } from 'src/assets/styles/GlobalStyles';
import { DeleteRecordResponse, DELETE_RECORD, Record } from 'src/lib/graphql/record';
import { useRecordDispatch } from 'src/lib/provider/RecordProvider';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MapContext } from 'src/lib/provider/MapProvider';

interface Props {
  record: Record;
  isFirst?: boolean;
}

const useStyles = (isFirst: boolean) => makeStyles({
  root : {
    display : 'flex',
    flexDirection : 'column',
    padding : '8px',
    borderBottom : '1px solid #e6e6e6',
    borderTop : isFirst => isFirst ? 'none' : '1px solid #e6e6e6'
  },
  titleRow : {
    display : 'flex',
    alignItems : 'center',
    flexWrap : 'nowrap'
  },
  title : {
    marginLeft : '4px',
    '&:hover' : {
      cursor : 'pointer',
      textDecoration : 'underline'
    }
  },
  content : {
    whiteSpace : 'pre-line'
  }
});


function RecordCardNonBoard({ record, isFirst = false } : Props) {
  const classes = useStyles(isFirst)();
  const dispatch = useRecordDispatch();
  const [deleteRecord] = useMutation<DeleteRecordResponse>(DELETE_RECORD);
  const { map, setMap } = useContext(MapContext);

  const [menu, setMenu] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(event.currentTarget);
  };

  const handleClose = () => {
    setMenu(null);
  };


  const handleDelete = () => {
    deleteRecord({
      variables : {
        id : record._id
      }
    }).then(res => {
      if (res.data) {
        dispatch({
          type : 'DELETE_LIST',
          payload : res.data.deleteRecord._id
        });
      }
    });
  };

  const handleClickTitle = () => {
    if (map) {
      const [x, y] = record.coordinate;
      map.setCenter(new naver.maps.LatLng(x, y));
    }
  };
  return (
    <Paper className={classes.root} elevation={0} square>
      <Box className={classes.titleRow}>
        <span role="img" aria-label="emoji">{record.emoji}</span>
        <Typography className={classes.title} variant="subtitle1" onClick={handleClickTitle}>
          {record.title}
        </Typography>
        <Spacer/>
        <IconButton size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}> 
          <MoreVertIcon/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={menu}
          keepMounted
          open={Boolean(menu)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
      <Box>
        <Typography variant="caption">
          {record.date}
        </Typography>
      </Box>
      <Box className={classes.content}>
        <Typography variant="body1" component="p">
          {record.content}
        </Typography>
      </Box>
    </Paper>
  );
}

export default React.memo(RecordCardNonBoard);
