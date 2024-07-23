import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Button, Stack, TextField, FormControl, Chip, Select, MenuItem, Pagination } from "@mui/material";
import MentorshipSearchCard from "./MentorshipSearchCard";

export type mentorship_info = {
  affiliated: boolean,
  approval_status: string,
  assigned_library_id: string,
  bio: string,
  date_joined: string,
  date_of_birth: string,
  email: string,
  family_status: string,
  family_support_level: Number,
  first_name: string,
  gender: string,
  grade_level: Number,
  graduation_obstacle: string,
  id: string,
  is_active: boolean,
  is_email_verified: boolean,
  is_librarian: boolean,
  is_mentor: boolean,
  is_onboarded: boolean,
  is_staff: boolean,
  is_student: boolean,
  is_superuser: boolean,
  is_verified: boolean,
  last_login: string,
  last_name: string,
  name: string,
  password: string,
  profileImage: string,
  role: Number,
  time_zone: string,
  user_id: string,
  username: string,
}

export interface mentorship_props {
  open_state: boolean,
  close: () => void,
  session_id: string,
  select_patron: (patron: any) => void,
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

  const [mentorship_students, set_mentorship_students] = useState([] as Array<mentorship_info>);
  useEffect(() => {
    fetch_mentorship_info((patrons: any) => { set_mentorship_students(patrons) })
  }, [])
  const [selected_patron, set_selected_patron] = useState(undefined as mentorship_info | undefined);

  const fetch_mentorship_info = (func: (fetched_info: Array<mentorship_info>) => void) => {
    fetch(`http://localhost:3000/portal/student_info?session_id=${props.session_id}`)
      .then(async (res) => {
        if (res.body != null) {
          let reader = res.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let stringified_body: string = '';
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
          let patrons: Array<mentorship_info> = JSON.parse(stringified_body)
          func(patrons)
        }
      })
      .catch(error => {
        console.error('Error reading stream:', error);
      });
  }

  const choose_patron = (patron: mentorship_info) => {
    set_selected_patron(patron);
  }

  const select_patron = () => {
    props.select_patron(selected_patron);
  }

  return (<Modal open={props.open_state} onClose={props.close}>
    <Box sx={style}>
      <Typography>A Modal Portal to the other Database</Typography>
      <TextField></TextField>
      <FormControl>
        <Select>
          <MenuItem></MenuItem>
        </Select>
      </FormControl>
      <Button> Add Filter</Button>
      <Chip></Chip>

      <FormControl>
        <Select>
          <MenuItem></MenuItem>
        </Select>
      </FormControl>
      <Button>Search</Button>

      <Stack>
        {mentorship_students.map((student_info) => {
          return (<MentorshipSearchCard student_info={student_info} select_handler={choose_patron} selected={selected_patron != undefined ? selected_patron.user_id == student_info.user_id : false}></MentorshipSearchCard>)
        })}
      </Stack>
      <Pagination>

      </Pagination>

      <Button onClick={props.close}>Close Modal</Button>
      <Button onClick={select_patron}> Select Patron</Button>
    </Box>
  </Modal>)
}

export default MentorshipConnectModal