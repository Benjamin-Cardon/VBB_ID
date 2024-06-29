import React from "react";
import { Box, Modal, Typography } from "@mui/material";
interface mentorship_props {
  open_state: boolean,
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
  return (<Modal open={props.open_state} onClose={close}>
    <Box sx={style}>
      <Typography>A Modal Portal to the other Database</Typography>
    </Box>
  </Modal>)
}

export default MentorshipConnectModal