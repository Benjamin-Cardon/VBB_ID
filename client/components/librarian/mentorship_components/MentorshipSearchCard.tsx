import React from "react";
import MentorshipDetailsDisplay from "./MentorshipDetailsDisplay";
import { mentorship_info } from "./MentorshipConnectModal";
import { Avatar, Box, IconButton, Paper, Typography } from "@mui/material";
export interface mentorship_search_card_props {
  student_info: mentorship_info;
}

function MentorshipSearchCard(props: mentorship_search_card_props) {
  return (<Paper>
    <Box>
      <Avatar></Avatar>
      <Typography></Typography>
      <IconButton></IconButton>
    </Box>
    <MentorshipDetailsDisplay student_info={props.student_info} open={false}></MentorshipDetailsDisplay>
  </Paper>)
}

export default MentorshipSearchCard