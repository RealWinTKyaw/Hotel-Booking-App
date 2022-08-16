import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import noMedia from "../../images/no-image.jpg";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '95%',
  backgroundColor: "#E0E0E2",
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  // display: "flex",
  // justifyContent: "center",
};

const outside = {
  
  overflowY:'auto'
}

const close = {
  position: 'absolute',
  right: '1em', 
  top: '.3em',
}

const booking = {
  position: "absolute",
  right: '1em',
  top: "3.5em",
}

export default function TransitionsModal(props) {
  const {details, open, handleClose, handleBooking} = props

  return (
    <div>
      <Modal
        style={outside}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        components={{Backdrop: Backdrop}}
        componentProps={{backdrop: {timeout: 500}}}S
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton size="large" sx={close} onClick={handleClose}>
              <CloseIcon/>
            </IconButton>
            <Button disabled={!props.canBook} variant="contained" size="large" sx={booking} onClick={handleBooking}>
              {props.canBook ? "Select room" : "Log in to book"}
            </Button>
            <img alt={"Room"} src={details.images.length > 0 ? details.images[0].url : noMedia}/>
            <Paper dangerouslySetInnerHTML={{__html: details.long_description || "No description"}} sx={{px:5, py:2}}/>
            {/* <Paper>
              <List>
                {details.amenities.map((item)=> {
                  return (
                    <ListItem disablePadding>
                      <ListItemText>{item}</ListItemText>
                    </ListItem>
                  )
                })}
              </List>
            </Paper> */}
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
