import React from "react";
import { mentorship_info } from "./MentorshipConnectModal";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
export interface mentorship_details_display_props {
  student_info: mentorship_info;
  open: boolean;
}

function MentorshipDetailsDisplay(props: mentorship_details_display_props) {
  return (<Modal open={props.open} >
    <Box>
      <Avatar></Avatar>
      <Typography></Typography>
      <Button>Select</Button>
      <Button>Cancel</Button>
    </Box>
  </Modal>)
}

export default MentorshipDetailsDisplay