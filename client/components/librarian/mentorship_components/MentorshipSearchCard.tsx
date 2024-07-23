import React, { useState } from "react";
import MentorshipDetailsDisplay from "./MentorshipDetailsDisplay";
import { mentorship_info } from "./MentorshipConnectModal";
import { Avatar, Box, IconButton, Icon, Paper, Typography } from "@mui/material";
import { Male, Female, KeyboardArrowDown } from "@mui/icons-material";
export interface mentorship_search_card_props {
  student_info: mentorship_info;
  select_handler: (patron: any) => void;
  selected: boolean;
}

function MentorshipSearchCard(props: mentorship_search_card_props) {
  const [open, setOpen] = useState(false);
  const on_open = () => {
    setOpen(true);
  }
  const on_close = () => {
    setOpen(false);
  }
  const handle_select = (patron: any) => {
    setOpen(false);
    props.select_handler(patron);
  }

  return (<Paper>
    <Box>
      <Avatar></Avatar>
      <Typography>Name: {props.student_info.first_name + " " + props.student_info.last_name}</Typography>
      <Typography>Username: {props.student_info.username}</Typography>
      {props.student_info.gender == "male" && <Male></Male>}
      {props.student_info.gender == "female" && <Female></Female>}
      <IconButton onClick={on_open} sx={{ justifyContent: 'flex-end' }} >
        <KeyboardArrowDown />
      </IconButton>
      {props.selected && <Typography>This is selected</Typography>}
    </Box>
    <MentorshipDetailsDisplay student_info={props.student_info} open={open} close_handler={on_close} select_handler={props.select_handler}></MentorshipDetailsDisplay>
  </Paper>)
}

export default MentorshipSearchCard