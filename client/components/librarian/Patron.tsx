import React from "react";
import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, Container, Divider, Button } from "@mui/material";
import { patron } from "../../types";
import { KeyboardArrowDown, ThreeP } from "@mui/icons-material";
function Patron({ patron }: { patron: patron }) {
  const [expanded, setExpanded] = useState(false);
  const on_expand = () => {
    setExpanded(!expanded);
  }
  return (
    <Paper>
      <Box>
        <Stack direction='row' spacing='2' >
          <Typography>{patron.profile.first_name + ' ' + patron.profile.last_name + " :"}</Typography>
          <Typography>{patron.patron_id}</Typography>
          <Typography> Last Login: {patron.last_login ? patron.last_login.toString() : "Never"}</Typography>
          <IconButton onClick={on_expand} sx={{ justifyContent: 'flex-end' }} >
            <KeyboardArrowDown />
          </IconButton>
        </Stack>
      </Box>
      {expanded && <Container>


        <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} alignContent='center' justifyContent='space-evenly'>
          <Container id='Left'>
            <Typography>General</Typography>
            <Typography>Patron has a library ID of : {patron.patron_id}</Typography>
            <Typography>Last Login: {patron.last_login ? patron.last_login.toString() : "Never"}</Typography>
            <Typography>Sign up date: {"Need to fill in"} </Typography>
            <Typography>Birthdate: {"Need to fill in"} </Typography>
            <Typography>Total Logins: {patron.count_logins ? patron.count_logins.toString() : "0"} </Typography>
          </Container>

          <Stack direction='column' divider={<Divider orientation="horizontal" flexItem />}>
            <Container>
              <Typography>Preferences</Typography>
              <Typography>This patrons wants the library to have: {patron.profile.desired_library_resource}</Typography>
              <Typography>Favorite Subject: {patron.profile.favorite_subject}</Typography>
              <Typography>Reason for attending Library:{patron.profile.library_attendance_goal}</Typography>
              <Typography>Most useful subject: {patron.profile.percieved_most_useful_subject}</Typography>
              <Typography>Most difficult subject: {patron.profile.percieved_most_difficult_subject}</Typography>
            </Container>
            <Container>
              <Typography> Situation</Typography>
              <Typography>This patron's main barrier to their education is: {patron.profile.barriers_to_education}</Typography>
              <Typography>This patron's family situation is :{patron.profile.family_status}</Typography>
              <Typography>That family has: {patron.profile.family_members} members.</Typography>
              <Typography>of which, {patron.profile.family_members_with_income} make an income.</Typography>
              <Typography>The patron feels that their family support is at a level of {patron.profile.family_support_level}</Typography>
              <Typography>It takes them {patron.profile.library_travel_time} to get to the library</Typography>
              <Typography>Which they discovered by: {patron.profile.library_discovery_method}</Typography>
            </Container>
          </Stack>
        </Stack>
        <Stack direction='row' alignContent='space-around' justifyContent='space-evenly'>
          <Button>Link to Mentorship</Button>
          <Button>Edit</Button>
        </Stack>
      </Container>}
    </Paper>
  );
}
export default Patron;

