import React from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import MentorshipSearchCard from "./MentorshipSearchCard";

export type mentorship_info = {

}

export interface mentorship_props {
  open_state: boolean,
  mentorship_students: Array<mentorship_info>,
  close: () => void
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function MentorshipConnectModal(props: mentorship_props) {
  return (<Modal open={props.open_state} onClose={props.close}>
    <Box sx={style}>
      <Typography>A Modal Portal to the other Database</Typography>
      <Button onClick={props.close}>Close Modal</Button>
    </Box>
  </Modal>)
}

export default MentorshipConnectModal