import React from "react";
import { Box, Modal, Typography, Button, Stack, TextField, FormControl, Chip, Select, MenuItem, Pagination } from "@mui/material";
import MentorshipSearchCard from "./MentorshipSearchCard";

type mentoring_session = {
  mentor: string,
  date: string,
  attended: boolean,
}

export type mentorship_info = {
  mentorship_id: Number,
  last_login: string,
  username: string,
  first_name: string,
  last_name: string,
  date_joined: string,
  date_of_birth: string,
  profile_image: string,
  gender: "male" | "female",
  assigned_library_id: Number,
  bio: string,
  sessions: Array<mentoring_session>,
  mentors: Array<string>,
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
        {props.mentorship_students.map((student_info) => {
          return (<MentorshipSearchCard student_info={student_info} ></MentorshipSearchCard>)
        })}
      </Stack>
      <Pagination>

      </Pagination>

      <Button onClick={props.close}>Close Modal</Button>
    </Box>
  </Modal>)
}

export default MentorshipConnectModal