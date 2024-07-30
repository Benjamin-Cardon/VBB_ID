import React from "react";
import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, Container, Divider, Button, TextField, Radio, RadioGroup, FormControl, SelectChangeEvent, FormLabel, Select, MenuItem, FormGroup, FormControlLabel, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { patron, library_attendance_goal, barriers_to_education, desired_library_resource } from "../../types";
import { options } from "./form_option_objects";
import { KeyboardArrowDown, } from "@mui/icons-material";
import { ChangeEvent } from "react";
import { useAuth } from "./AuthContext";
import CheckIcon from '@mui/icons-material/Check';

export type patron_props = {
  patron_prop: patron,
  update_fetched: (patron: patron) => void,
  open_mentorship: () => void
}
function Patron(props: patron_props) {
  const session_id = useAuth().session_id;
  const [patron, setPatron] = useState(props.patron_prop)
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [situation, setSituation] = useState(false);
  const [edited, setEdited] = useState(patron);
  const [edit, setEdit] = useState(false);
  const [goalSelect, setGoalSelect] = useState('' as library_attendance_goal | "");
  const [barrierSelect, setBarrierSelect] = useState('' as barriers_to_education | "");
  const [resourceSelect, setResourceSelect] = useState('' as desired_library_resource | "");
  const [open_dialog, set_open_dialog] = useState(false);

  const on_expand = () => {
    setExpanded(!expanded);
    setEdit(false);
    setEdited(patron);
  }

  const on_edit = () => {
    setEdit(!edit);
  }

  const on_preferences = () => setPreferences(!preferences)
  const on_situation = () => setSituation(!situation)
  const on_delete_chip = (state: 'desired_library_resource' | 'library_attendance_goal' | 'barriers_to_education', value: any) => {
    return () => {
      console.log(value, state)
      let ind = edited.profile[state].findIndex((val) => { return val == value });
      let obj = { ...edited };
      obj.profile[state].splice(ind, 1);
      setEdited(obj);
    }
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
  const add_chip = (state: 'desired_library_resource' | 'library_attendance_goal' | 'barriers_to_education') => {
    if (state == 'desired_library_resource') {
      return () => {
        if (resourceSelect != "") {
          let obj = { ...edited };
          obj.profile[state].push(resourceSelect);
          setEdited(obj);
          setResourceSelect('');
        }
      }
    } else if (state == 'library_attendance_goal') {
      if (goalSelect != "") {
        return () => {
          let obj = { ...edited };
          obj.profile[state].push(goalSelect);
          setEdited(obj);
          setGoalSelect('');
        }
      }

    } else if (state == 'barriers_to_education') {
      if (barrierSelect != "") {
        return () => {
          let obj = { ...edited };
          obj.profile[state].push(barrierSelect);
          setEdited(obj);
          setBarrierSelect('');
        }
      }
    }
  }

  const on_submit_changes = () => {
    fetch("http://localhost:3000/patrons/update_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ modified_patron_profile: edited, session_id })
    }).then(async (res) => {
      if (res.body != null) {
        let reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let stringified_body: string = '';
        while (true) {
          let { done, value } = await reader.read();
          if (value != undefined) {
            stringified_body = stringified_body.concat(decoder.decode(value));
          }
          if (done) {
            break;
          }
        }
        if (stringified_body == "Update Successful") {
          handle_update_success();

        } else {
          console.log("No auth success. ")
        }
      }
    })
  }
  const handle_update_success = () => {
    props.update_fetched(edited)
    setPatron(edited)
    setEdit(false)
  }
  const on_link = () => {
    props.open_mentorship();
  }
  const close_dialog_handler = () => {
    set_open_dialog(false);
  };
  const open_dialog_handler = () => {
    set_open_dialog(true);
  };
  const disaffiliate = () => {
    close_dialog_handler()
  };

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
          {patron.profile.mentorship_user_id && <CheckIcon></CheckIcon>}
        </Stack>
      </Box>
      {expanded && <Container>
        <Dialog open={open_dialog}
          onClose={close_dialog_handler}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Would you like to disconnect this patron from the mentorship account they're currently connected to?
            </DialogContentText>
            <DialogActions>
              <Button onClick={close_dialog_handler}>Cancel</Button>
              <Button onClick={disaffiliate}>Yes, Disconnect</Button>
            </DialogActions>
          </DialogContent>

        </Dialog>

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
                    <FormLabel>What resources would you like the library to have?</FormLabel>
                    <Select
                      value={resourceSelect}
                      // @ts-ignore:
                      onChange={(e) => { setResourceSelect(e.target.value) }}
                    >
                      {options.desired_library_resource.map((level) => {
                        if (!edited.profile.desired_library_resource.includes(level)) {
                          return (<MenuItem value={level}>{level}</MenuItem>)
                        }
                      })}
                    </Select>
                  </FormControl>
                  <Button onClick={add_chip("desired_library_resource")} title="Add Desired Resource">Add Desired Resource</Button>
                  {edited.profile.desired_library_resource.map((resource) => <Chip label={resource} onDelete={on_delete_chip('desired_library_resource', resource)}></Chip>)}

                  <FormControl>
                    <FormLabel>Including yourself, how many family members do you have living in your home? </FormLabel>
                    <Select
                      value={edited.profile.family_members}
                      onChange={change_state_select('family_members')}
                    >
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

                  <FormControl>
                    <FormLabel>What are your goals in attending our library</FormLabel>
                    <Select
                      value={goalSelect}
                      // @ts-ignore:
                      onChange={(e) => { setGoalSelect(e.target.value) }}>
                      {options.library_attendance_goal.map((goal) => {
                        if (!edited.profile.library_attendance_goal.includes(goal)) {
                          return (<MenuItem value={goal}>{goal}</MenuItem>)
                        }
                      })}
                    </Select>
                  </FormControl>
                  <Button onClick={add_chip("library_attendance_goal")} title="Add Goal">Add Goal</Button>
                  {edited.profile.library_attendance_goal.map((goal) => <Chip label={goal} onDelete={on_delete_chip('library_attendance_goal', goal)}></Chip>)}
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
                  <FormControl>
                    <FormLabel>What barriers does this patron face to recieving more education?</FormLabel>
                    <Select
                      value={barrierSelect}
                      // @ts-ignore:
                      onChange={(e) => { setBarrierSelect(e.target.value) }}>
                      {options.barriers_to_education.map((barrier) => {
                        if (!edited.profile.barriers_to_education.includes(barrier)) {
                          return (<MenuItem value={barrier}>{barrier}</MenuItem>)
                        }
                      })}
                    </Select>
                  </FormControl>
                  <Button onClick={add_chip("barriers_to_education")} title="Add Barrier">Add Barrier</Button>
                  {edited.profile.barriers_to_education.map((barrier) => <Chip label={barrier} onDelete={on_delete_chip('barriers_to_education', barrier)}></Chip>)}
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
          {patron.profile.mentorship_user_id == undefined && <Button onClick={on_link}>Link to Mentorship</Button>}
          {patron.profile.mentorship_user_id && <Button onClick={open_dialog_handler}>Disconnect from Mentorship</Button>}
          <Button onClick={on_edit}>{edit ? "Cancel Edit" : "Edit"}</Button>
          {edit && <Button onClick={on_submit_changes}>Save Changes</Button>}
        </Stack>
      </Container>}
    </Paper >
  );
}
export default Patron;

