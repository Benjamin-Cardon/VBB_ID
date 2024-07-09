import React from "react";
import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, Container, Divider, Button, TextField, Radio, RadioGroup, FormControl, SelectChangeEvent, FormLabel, Select, MenuItem, FormGroup, FormControlLabel, Chip } from "@mui/material";
import { patron } from "../../types";
import { options } from "./form_option_objects";
import { KeyboardArrowDown, } from "@mui/icons-material";
import { ChangeEvent } from "react";
function Patron({ patron }: { patron: patron }) {

  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [situation, setSituation] = useState(false);
  const [edited, setEdited] = useState(patron);
  const [edit, setEdit] = useState(false);


  const on_expand = () => {
    setExpanded(!expanded);
    setEdit(false);
  }

  const on_edit = () => {
    setEdit(!edit);
  }

  const on_preferences = () => setPreferences(!preferences)
  const on_situation = () => setSituation(!situation)
  const on_delete_chip = (state: string) => {

  }
  function change_state_select(state: string) {
    return (e: SelectChangeEvent) => {
      let obj = { ...edited };
      //@ts-ignore
      obj.profile[state] = e.target.value;
      setEdited(obj)
    };
  }

  function change_state_text(state: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      let obj = { ...edited };
      //@ts-ignore
      obj.profile[state] = e.target.value;
      setEdited(obj)
    };
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
                  {edited.profile.desired_library_resource.map((resource) => <Chip label={resource} onDelete={on_delete_chip('resource')}></Chip>)}

                  <FormControl>
                    <FormLabel>Including yourself, how many family members do you have living in your home? </FormLabel>
                    <Select
                      value={edited.profile.family_members}
                      onChange={change_state_select('family_members')}>
                      {options.family_members.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Which subject do you enjoy the most in school?</FormLabel>
                    <Select
                      value={edited.profile.favorite_subject}
                      onChange={change_state_select('favorite_subject')}>
                      {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>What subject do you believe will be most useful for your future career?</FormLabel>
                    <Select
                      value={edited.profile.percieved_most_useful_subject}
                      onChange={change_state_select('percieved_most_useful_subject')}>
                      {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
                    </Select>
                  </FormControl>

                  <FormControl >
                    <FormLabel>What subject do you find most difficult in school and need help with?</FormLabel>
                    <Select
                      value={edited.profile.percieved_most_difficult_subject}
                      onChange={change_state_select('percieved_most_difficult_subject')}>
                      {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
                    </Select>
                  </FormControl>

                  {edited.profile.library_attendance_goal.map((goal) => <Chip label={goal} onDelete={on_delete_chip('goal')}></Chip>)}
                </>}
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
                  {edited.profile.barriers_to_education.map((barrier) => <Chip label={barrier} onDelete={on_delete_chip('barrier')}></Chip>)}
                  <FormControl >
                    <FormLabel>What is your current family status?</FormLabel>
                    <RadioGroup
                      value={edited.profile.family_status}
                      onChange={change_state_text("family_status")}>
                      {options.family_statuses.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                    </RadioGroup>
                  </FormControl>
                  <FormControl >
                    <FormLabel>Including yourself, how many family members do you have living in your home? </FormLabel>
                    <Select
                      value={edited.profile.family_members}
                      onChange={change_state_select('family_members')}>
                      {options.family_members.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
                    </Select>
                  </FormControl>
                  <FormControl >
                    <FormLabel>How many members of your family have jobs that provide income?</FormLabel>
                    <RadioGroup
                      value={edited.profile.family_members_with_income}
                      onChange={change_state_text("family_members_with_income")}>
                      {options.family_members_with_income.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                    </RadioGroup>
                  </FormControl>
                  <FormControl >
                    <FormLabel>How would you rate the level of support you receive from your family?</FormLabel>
                    <RadioGroup
                      value={edited.profile.family_support_level}
                      onChange={change_state_text("family_support_level")}>
                      {options.family_support_level.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                    </RadioGroup>
                  </FormControl>

                  <FormControl >
                    <FormLabel> How long does it take you to travel to the library?</FormLabel>
                    <RadioGroup
                      value={edited.profile.library_travel_time}
                      onChange={change_state_text("library_travel_time")}>
                      {options.library_travel_time.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                    </RadioGroup>
                  </FormControl>

                  <FormControl >
                    <FormLabel>How did you hear about our library?</FormLabel>
                    <RadioGroup
                      value={edited.profile.library_discovery_method}
                      onChange={change_state_text("library_discovery_method")}>
                      {options.library_discovery_method.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
                    </RadioGroup>
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

