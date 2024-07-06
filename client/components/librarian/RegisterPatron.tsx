import React, { ChangeEvent } from "react";
import { useState } from "react";
import { TextField, FormControl, RadioGroup, Radio, FormLabel, FormControlLabel, Select, Checkbox, FormGroup, Button, MenuItem, SelectChangeEvent, Stack, Divider, Container, Box, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { props } from "../Librarian";
import { family_members, register_state, family_status, family_members_with_income } from "../../types";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { options } from "./form_option_objects";
import { useAuth } from "./AuthContext";
import MentorshipConnectModal from "./MentorshipConnectModal";

function RegisterPatron(register_props: props) {
  const session_id = useAuth().session_id;
  const init_values: register_state = {
    first_name: '',
    last_name: '',
    gender: '',
    date: dayjs(),
    grade_level: '',
    family_members: '',
    family_status: "",
    family_members_with_income: '',
    family_support_level: '',
    favorite_subject: '',
    percieved_most_difficult_subject: '',
    percieved_most_useful_subject: '',
    library_discovery_method: '',
    library_travel_time: '',
    desired_library_resource: "",
    barriers_to_education: "",
    library_attendance_goal: ""
  }

  let init_errors = {
    student: false,
    first_name: false,
    last_name: false,
    gender: false,
    date: false,
    grade_level: false,
    family_members: false,
    family_status: false,
    family_members_with_income: false,
    barriers_to_education: false,
    family_support_level: false,
    favorite_subject: false,
    percieved_most_difficult_subject: false,
    percieved_most_useful_subject: false,
    library_discovery_method: false,
    library_travel_time: false,
    desired_library_resource: false,
    library_attendance_goal: false,
  }
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

  const [form_state, set_form_state] = useState(init_values);
  const [error_state, set_error_state] = useState(init_errors);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [student, setStudent] = useState("");
  const [barriers_to_education, set_barriers_to_education] = useState(init_barriers)
  const [goals, set_goals] = useState(init_goals)
  const [desired_library_resources, set_desired_libarary_resources] = useState(init_desired_resources);

  const handleClickOpen = (devCode: string) => {
    setOpen(true);
    setCode(devCode);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function register() {
    let new_errors = { ...error_state }
    let has_errors = false;
    Object.keys(form_state).forEach((key) => {
      if (key == "library_attendance_goal" || key == "barriers_to_education" || key == "desired_library_resource") {
        return;
      }
      //@ts-ignore
      if (form_state[key] == '') {

        console.log("Error at key", key)
        //@ts-ignore
        new_errors[key] = true;
        has_errors = true;
      } else {
        //@ts-ignore
        new_errors[key] = false;
      }
    }
    );
    if (has_errors) {
      console.log("has errors")
      console.log(new_errors)
      set_error_state(new_errors);
    } else {
      let barriers_to_education_arr: string[] = [];
      let goals_arr: string[] = [];
      let desired_library_resources_arr: string[] = [];
      for (const [key, value] of Object.entries(barriers_to_education)) {
        if (value) {
          barriers_to_education_arr.push(key);
        }
      }
      for (const [key, value] of Object.entries(goals)) {
        if (value) {
          goals_arr.push(key);
        }
      }
      for (const [key, value] of Object.entries(desired_library_resources)) {
        if (value) {
          desired_library_resources_arr.push(key);
        }
      }
      let body_obj = { ...form_state, desired_library_resources: desired_library_resources_arr, goals: goals_arr, barriers_to_education: barriers_to_education_arr, student: student };
      fetch("http://localhost:3000/patrons/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ register_form: body_obj, session_id })
      }).then(async (res) => {
        let stringified_body: string = '';
        if (res.body != null) {
          let reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          while (true) {
            let { done, value } = await reader.read();
            if (value != undefined) {
              stringified_body = stringified_body.concat(decoder.decode(value));
              console.log(stringified_body);
            }
            if (done) {
              break;
            }
          }
        }
        handleClickOpen(stringified_body)
      })
    }
  }

  // we'll make a list of keys type later
  function change_state_text(state: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      let obj = { ...form_state };
      //@ts-ignore
      obj[state] = e.target.value;
      set_form_state(obj)
    };
  }

  function change_state_select(state: string) {
    return (e: SelectChangeEvent) => {
      let obj = { ...form_state };
      //@ts-ignore
      obj[state] = e.target.value;
      set_form_state(obj)
    };
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


  return (<div>
    <Button onClick={(e) => { register_props.changePage('LibrarianMenu') }}>Main Menu</Button>
    <Container maxWidth='md'>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {"Your Patron ID"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please write this down! You will need to use this code to login to the libarary. Your code is: {code}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              O.K.
            </Button>
          </DialogActions>
        </Dialog>

        <Stack
          direction="column"
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={2}
        >
          <TextField value={form_state.first_name} onChange={change_state_text('first_name')} label="First Name" error={error_state.first_name} />
          <TextField value={form_state.last_name} onChange={change_state_text('last_name')} label="Last Name" error={error_state.last_name} />

          <FormControl error={error_state.gender}>
            <FormLabel>What's your gender?</FormLabel>
            <RadioGroup
              value={form_state.gender}
              onChange={change_state_text("gender")}>
              <FormControlLabel value='female' control={<Radio />} label='Female' />
              <FormControlLabel value='male' control={<Radio />} label='Male' />
            </RadioGroup>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={form_state.date} onChange={(e) => set_form_state({ ...form_state, date: e })} />
          </LocalizationProvider>

          <FormControl error={error_state.student}>
            <FormLabel>Are you currently a student? ie: seeking a formal education, or under the age of 18?</FormLabel>
            <RadioGroup
              value={student}
              onChange={(e) => setStudent(e.target.value)}>
              <FormControlLabel value="Student" control={<Radio />} label="Student" />
              <FormControlLabel value="Non-Student" control={<Radio />} label="Non-Student" />
            </RadioGroup>
          </FormControl>

          {student == "Student" && <div>
            <FormControl error={error_state.grade_level}>
              <FormLabel> What grade are you in?</FormLabel>
              <Select
                value={form_state.grade_level}
                onChange={change_state_select('grade_level')}>
                {options.grade_levels.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
              </Select>
            </FormControl>

            <FormControl error={error_state.barriers_to_education}>
              <FormLabel>What are the main obstacles or challenges that have prevented you from continuing or completing your education?</FormLabel>
              <FormGroup>
                {options.barriers_to_education.map((option) => <FormControlLabel control={<Checkbox checked={barriers_to_education[option]} onChange={change_state_check("barriers to education")} name={option} />} label={option} />)}
              </FormGroup>
            </FormControl>

            <FormControl error={error_state.favorite_subject}>
              <FormLabel>Which subject do you enjoy the most in school?</FormLabel>
              <Select
                value={form_state.favorite_subject}
                onChange={change_state_select('favorite_subject')}>
                {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
              </Select>
            </FormControl>

            <FormControl error={error_state.percieved_most_useful_subject}>
              <FormLabel>What subject do you believe will be most useful for your future career?</FormLabel>
              <Select
                value={form_state.percieved_most_useful_subject}
                onChange={change_state_select('percieved_most_useful_subject')}>
                {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
              </Select>
            </FormControl>

            <FormControl error={error_state.percieved_most_difficult_subject}>
              <FormLabel>What subject do you find most difficult in school and need help with?</FormLabel>
              <Select
                value={form_state.percieved_most_difficult_subject}
                onChange={change_state_select('percieved_most_difficult_subject')}>
                {options.subjects.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
              </Select>
            </FormControl>
          </div>
          }
          {student != '' && <div>
            <FormControl error={error_state.family_members}>
              <FormLabel>Including yourself, how many family members do you have living in your home? </FormLabel>
              <Select
                value={form_state.family_members}
                onChange={change_state_select('family_members')}>
                {options.family_members.map((level) => { return (<MenuItem value={level}>{level}</MenuItem>) })}
              </Select>
            </FormControl>

            <FormControl error={error_state.family_status}>
              <FormLabel>What is your current family status?</FormLabel>
              <RadioGroup
                value={form_state.family_status}
                onChange={change_state_text("family_status")}>
                {options.family_statuses.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
              </RadioGroup>
            </FormControl>

            <FormControl error={error_state.family_members_with_income}>
              <FormLabel>How many members of your family have jobs that provide income?</FormLabel>
              <RadioGroup
                value={form_state.family_members_with_income}
                onChange={change_state_text("family_members_with_income")}>
                {options.family_members_with_income.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
              </RadioGroup>
            </FormControl>

            <FormControl error={error_state.family_support_level}>
              <FormLabel>How would you rate the level of support you receive from your family?</FormLabel>
              <RadioGroup
                value={form_state.family_support_level}
                onChange={change_state_text("family_support_level")}>
                {options.family_support_level.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
              </RadioGroup>
            </FormControl>

            <FormControl error={error_state.library_discovery_method}>
              <FormLabel>How did you hear about our library?</FormLabel>
              <RadioGroup
                value={form_state.library_discovery_method}
                onChange={change_state_text("library_discovery_method")}>
                {options.library_discovery_method.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
              </RadioGroup>
            </FormControl>

            <FormControl error={error_state.library_travel_time}>
              <FormLabel> How long does it take you to travel to the library?</FormLabel>
              <RadioGroup
                value={form_state.library_travel_time}
                onChange={change_state_text("library_travel_time")}>
                {options.library_travel_time.map((option) => <FormControlLabel value={option} control={<Radio />} label={option} />)}
              </RadioGroup>
            </FormControl>

            <FormControl error={error_state.desired_library_resource}>
              <FormLabel>What additional resources or services would you like to see in the library? multiple choices</FormLabel>
              <FormGroup>
                {options.desired_library_resource.map((option) => <FormControlLabel control={<Checkbox checked={desired_library_resources[option]} onChange={change_state_check("desired resources")} name={option} />} label={option} />)}
              </FormGroup>
            </FormControl>

            <FormControl error={error_state.library_attendance_goal}>
              <FormLabel> What do you expect to achieve from using our library? multiple choices</FormLabel>
              <FormGroup>
                {options.library_attendance_goal.map((option) => <FormControlLabel control={<Checkbox checked={goals[option]} onChange={change_state_check("goals")} name={option} />} label={option} />)}
              </FormGroup>
            </FormControl>
          </div>}

        </Stack>
        {student != '' && <Box mt='2'>
          <Button onClick={register}> Submit</Button>
        </Box>}

      </Box>


    </Container>
  </div >)
}

export default RegisterPatron