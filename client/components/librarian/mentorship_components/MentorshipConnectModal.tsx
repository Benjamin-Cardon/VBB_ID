import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Button, Stack, Switch, TextField, FormControl, Chip, Select, MenuItem, Pagination } from "@mui/material";
import MentorshipSearchCard from "./MentorshipSearchCard";
import { SearchTwoTone } from "@mui/icons-material";

export type mentorship_info = {
  affiliated: boolean,
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
  last_login: string,
  last_name: string,
  name: string,
  password: string,
  profileImage: string,
  time_zone: string,
  user_id: string,
  username: string,
  displayed?: boolean
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
  const search_options = ["username", "first_name", "last_name", "name", "email", "bio"]
  const [mentorship_students, set_mentorship_students] = useState([] as Array<mentorship_info>);
  const [displayed_students, set_displayed_students] = useState([] as Array<mentorship_info>)
  const [selected_patron, set_selected_patron] = useState(undefined as mentorship_info | undefined);
  const [seeHidden, setSeeHidden] = useState(false);
  const [search_option, set_search_option] = useState("username");
  const MAGIC_NUMBER_DISPLAYED_PATRONS = 6;
  const [page, set_page] = useState(1);
  const [pages, set_pages] = useState(1);

  useEffect(() => {
    fetch_mentorship_info((patrons: any) => {
      set_mentorship_students(patrons)
      let count = patrons.filter((student: any) => !student.affiliated).length
      set_pages(Math.ceil(count / MAGIC_NUMBER_DISPLAYED_PATRONS))
    })
  }, [])

  useEffect(() => {
    let displayed: Array<mentorship_info> = [];
    let count = 0;
    for (let i = 0; i < mentorship_students.length; i++) {
      if (!mentorship_students[i].displayed) {
        continue;
      }
      count++;
      if (count > page - 1 * MAGIC_NUMBER_DISPLAYED_PATRONS && count <= page * MAGIC_NUMBER_DISPLAYED_PATRONS) {
        displayed.push(mentorship_students[i]);
        if (count == page * MAGIC_NUMBER_DISPLAYED_PATRONS) {
          break;
        }
      }
      set_displayed_students(displayed);
    }
  }, [mentorship_students, page])



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
          patrons.forEach((patron) => { patron.displayed = !patron.affiliated })
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
  const on_text_search = (option: string) => {
    return () => {
      console.log("Searched text with a particular option", option);
    }
  }
  const on_see_hidden = () => {
    if (seeHidden) {

    } else {

    }

    setSeeHidden(!seeHidden)
  }

  return (<Modal open={props.open_state} onClose={props.close}>
    <Box sx={style}>
      <Typography>A Modal Portal to the other Database</Typography>
      <Box>
        <TextField label="Search Text"></TextField>
        <FormControl>
          <Select value={search_option}
            onChange={(e) => set_search_option(e.target.value)}>
            {search_options.map((option) => (<MenuItem value={option}>{option}</MenuItem>))}
          </Select>
        </FormControl>
        <Button onClick={on_text_search(search_option)}>Search</Button>
      </Box>
      <Box>
        <FormControl>
          <Select>
            <MenuItem></MenuItem>
          </Select>
        </FormControl>
        <Button> Add Filter</Button>
        <Chip></Chip>
      </Box>

      <Stack>
        {displayed_students.map((student_info) => {
          return (<MentorshipSearchCard student_info={student_info} select_handler={choose_patron} selected={selected_patron != undefined ? selected_patron.user_id == student_info.user_id : false}></MentorshipSearchCard>)
        })}
      </Stack>
      <Pagination page={page} count={pages}>
      </Pagination>
      <Box>
        <Typography>See Students who have already been affiliated</Typography>
        <Switch checked={seeHidden} onChange={on_see_hidden} ></Switch>
      </Box>

      <Button onClick={props.close}>Close Modal</Button>
      <Button onClick={select_patron}> Select Patron</Button>
    </Box>
  </Modal>)
}

export default MentorshipConnectModal