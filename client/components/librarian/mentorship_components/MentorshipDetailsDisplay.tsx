import React from "react";
import { mentorship_info } from "./MentorshipConnectModal";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
export interface mentorship_details_display_props {
  student_info: mentorship_info;
  open: boolean;
  close_handler: () => void;
  select_handler: (patron: any) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function MentorshipDetailsDisplay(props: mentorship_details_display_props) {
  const handle_select = () => {
    props.select_handler(props.student_info)
    props.close_handler();
  }

  return (<Modal open={props.open} onClose={props.close_handler} >
    <Box sx={style}>
      <Avatar></Avatar>
      <Typography></Typography>
      <Button onClick={handle_select}>Select</Button>
      <Button onClick={props.close_handler}>Cancel</Button>
    </Box>
  </Modal>)
}

export default MentorshipDetailsDisplay