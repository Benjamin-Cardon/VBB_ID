import React from "react";
import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, Container, Divider, Button, TextField, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { patron } from "../../types";
import { options } from "./form_option_objects";
import { KeyboardArrowDown, ThreeP } from "@mui/icons-material";
function Patron({ patron }: { patron: patron }) {
  let init_barriers = {
    "Family Responsibilities: Need to work or take care of siblings": false,
    "Family and Cultural Barriers: Lack of family support, cultural barriers to education": false,
    "Financial Constraints: Lack of money to buy food or pay school fees, not enough money for education": false,
    "Distance from School: No nearby schools": false,
    "Lack of School Materials: Books, uniforms, schools without proper resources": false,
    "Safety concerns: on the way to school or in school": false,
    "Health and Nutrition Issues: Lack of proper nutrition causing health issues, poor health or disabilities": false,
    "Lack of Technology Access: Internet, computers for homework or study": false,
    "Early Life Changes: Early marriage, pregnancy": false,
    "Insufficient Educational Infrastructure: Insufficient teachers, overcrowded classes, limited opportunities for higher education": false,
    "Political Instability": false
  }
  let init_goals = {
    "Improve my performance in one or more school subjects": false,
    "Enhance my language skills": false,
    "Access computers and the internet": false,
    "Read or borrow books": false,
    "Utilize a quiet space for studying": false,
    "Participate in the mentor program": false
  }
  let init_desired_resources = {
    "More Books and E-books": false,
    "Study and Meeting Spaces": false,
    "Computers and Internet Access": false,
    "Workshops and Educational Programs": false,
    "Educational activities": false,
    "Multimedia Resources: Access to audio - books, movies, music, and other digital media.": false,
    "Career and Job Assistance": false,
    "Art supplies": false
  }
  for (let resource of patron.profile.desired_library_resource) {
    init_desired_resources[resource] = true;
  }
  for (let barrier of patron.profile.barriers_to_education) {
    init_barriers[barrier] = true;
  }
  for (let goal of patron.profile.library_attendance_goal) {
    init_goals[goal] = true;
  }

  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [situation, setSituation] = useState(false);
  const [edited, setEdited] = useState(patron);
  const [edit, setEdit] = useState(false);
  const [barriers_to_education, set_barriers_to_education] = useState(init_barriers)
  const [goals, set_goals] = useState(init_goals)
  const [desired_library_resources, set_desired_libarary_resources] = useState(init_desired_resources);

  const on_expand = () => {
    setExpanded(!expanded);
    setEdit(false);
  }

  const on_edit = () => {
    setEdit(!edit);
  }
  const change_state_check = (state: string) => {
    if (state == "goals") {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        set_goals({
          ...goals, [event.target.name]: event.target.checked
        })
      }
    } else if (state == "desired resources") {
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        set_desired_libarary_resources(
          { ...desired_library_resources, [event.target.name]: event.target.checked, }
        )
      }
    } else if (state == "barriers to education")
      return (event: React.ChangeEvent<HTMLInputElement>) => {
        set_barriers_to_education({
          ...barriers_to_education,
          [event.target.name]: event.target.checked,
        });
      }
  };

  const on_preferences = () => setPreferences(!preferences)
  const on_situation = () => setSituation(!situation)

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
            {!edit && <Typography>Birthdate: {patron.profile.date} </Typography>}
            {edit && <TextField></TextField>}

            <Typography>Total Logins: {patron.count_logins ? patron.count_logins.toString() : "0"} </Typography>
          </Container>

          <Stack direction='column' divider={<Divider orientation="horizontal" flexItem />}>
            <Container>
              <Button variant='text' onClick={on_preferences}>Preferences</Button>
              {preferences && <div>
                {!edit && <><Typography>This patrons wants the library to have: {patron.profile.desired_library_resource}</Typography>
                  <Typography>Favorite Subject: {patron.profile.favorite_subject}</Typography>
                  <Typography>Reason for attending Library:{patron.profile.library_attendance_goal}</Typography>
                  <Typography>Most useful subject: {patron.profile.percieved_most_useful_subject}</Typography>
                  <Typography>Most difficult subject: {patron.profile.percieved_most_difficult_subject}</Typography></>}
                {edit && <>
                  <FormControl>
                    <FormLabel>What additional resources or services would you like to see in the library? multiple choices</FormLabel>
                    <FormGroup>
                      {options.desired_library_resource.map((option) => <FormControlLabel control={<Checkbox checked={desired_library_resources[option]} onChange={change_state_check("desired resources")} name={option} />} label={option} />)}
                    </FormGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel> What do you expect to achieve from using our library? multiple choices</FormLabel>
                    <FormGroup>
                      {options.library_attendance_goal.map((option) => <FormControlLabel control={<Checkbox checked={goals[option]} onChange={change_state_check("goals")} name={option} />} label={option} />)}
                    </FormGroup>
                  </FormControl></>}
              </div>}
            </Container>
            <Container>
              <Button variant="text" onClick={on_situation}>Situation</Button>
              {situation && <div>
                {!edit && <><Typography>This patron's main barrier to their education is: {patron.profile.barriers_to_education}</Typography>
                  <Typography>This patron's family situation is :{patron.profile.family_status}</Typography>
                  <Typography>That family has: {patron.profile.family_members} members.</Typography>
                  <Typography>of which, {patron.profile.family_members_with_income} make an income.</Typography>
                  <Typography>The patron feels that their family support is at a level of {patron.profile.family_support_level}</Typography>
                  <Typography>It takes them {patron.profile.library_travel_time} to get to the library</Typography>
                  <Typography>Which they discovered by: {patron.profile.library_discovery_method}</Typography></>}
                {edit && <>
                  <FormControl>
                    <FormLabel>What are the main obstacles or challenges that have prevented you from continuing or completing your education?</FormLabel>
                    <FormGroup>
                      {options.barriers_to_education.map((option) => <FormControlLabel control={<Checkbox checked={barriers_to_education[option]} onChange={change_state_check("barriers to education")} name={option} />} label={option} />)}
                    </FormGroup>
                  </FormControl>
                </>}
              </div>}
            </Container>
          </Stack>
        </Stack>
        <Stack direction='row' alignContent='space-around' justifyContent='space-evenly'>
          <Button>Link to Mentorship</Button>
          <Button onClick={on_edit}>Edit</Button>
        </Stack>
      </Container>}
    </Paper>
  );
}
export default Patron;

