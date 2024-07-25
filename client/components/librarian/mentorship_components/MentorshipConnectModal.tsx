import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Button, Stack, Switch, TextField, FormControl, Chip, Select, MenuItem, Pagination } from "@mui/material";
import MentorshipSearchCard from "./MentorshipSearchCard";
import { FollowTheSignsRounded, SearchTwoTone } from "@mui/icons-material";
import dayjs from "dayjs";
import { createIsAfterIgnoreDatePart } from "@mui/x-date-pickers/internals/utils/time-utils";

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
  const [filters, set_filters] = useState({ gender_male: false, gender_female: false, under_12: false, under_18: false, over_18: false, login_last_month: false, login_last_6month: false, login_more_than_6month: false });
  const [filter_select, set_filter_select] = useState("under_12");

  const check_male = (patron: mentorship_info) => patron.gender == "male";
  const check_female = (patron: mentorship_info) => patron.gender == "female";
  const check_under_12 = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.date_of_birth).unix() < 3.784e+11;
  const check_under_18 = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.date_of_birth).unix() < 5.68e+11;
  const check_over_18 = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.date_of_birth).unix() > 5.68e+11;
  const check_login_last_month = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.last_login).unix() < 2.628e+9;
  const check_login_last_6month = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.last_login).unix() < 1.577e+10;
  const check_login_more_than_6month = (patron: mentorship_info) => Date.now() - 1000 * dayjs(patron.last_login).unix() > 1.577e+10;

  const check_patron_by_filters = (patron: mentorship_info): boolean => {
    if (filters.gender_female) {
      if (!check_female(patron)) {
        return false;
      }
    }
    if (filters.gender_male) {
      if (!check_male(patron)) {
        return false;
      }
    }
    if (filters.login_last_month) {
      if (!check_login_last_month(patron)) {
        return false;
      }
    }
    if (filters.login_last_6month) {
      if (!check_login_last_6month(patron)) {
        return false;
      }
    }
    if (filters.login_more_than_6month) {
      if (!check_login_more_than_6month(patron)) {
        return false;
      }
    }
    if (filters.under_12) {
      if (!check_under_12(patron)) {
        return false;
      }
    }
    if (filters.under_18) {
      if (!check_under_18(patron)) {
        return false;
      }
    }
    if (filters.over_18) {
      if (!check_over_18(patron)) {
        return false;
      }
    }
    return true;
  }

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
  useEffect(() => {
    let arr = [...mentorship_students].map((student) => { return { ...student, displayed: seeHidden ? true : !student.affiliated && check_patron_by_filters(student) } });
    set_mentorship_students(arr);
  }, [filters])


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
    let arr = [...mentorship_students];
    if (!seeHidden) {
      arr = arr.map((student) => { return { ...student, displayed: check_patron_by_filters(student) } });
    } else {
      arr = arr.map((student) => { return { ...student, displayed: !student.affiliated && check_patron_by_filters(student) } })
    }
    set_mentorship_students(arr);
    set_page(1);
    setSeeHidden(!seeHidden)
  }
  const on_add_filter = () => {
    let obj = { ...filters };
    //@ts-ignore
    obj[filter_select] = true;
    set_filters(obj);
  };

  const on_delete_chip = (val: string) => {
    return () => {
      let obj = { ...filters }
      //@ts-ignore
      obj[val] = false;
      set_filters(obj);
    }
  };

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
          <Select
            label={"Filter Options"}
            value={filter_select}
            onChange={(e) => set_filter_select(e.target.value)}>
            {!(filters.gender_female || filters.gender_male) && <MenuItem value={"gender_male"}>Male</MenuItem>}
            {!(filters.gender_female || filters.gender_male) && <MenuItem value={"gender_female"}>Female</MenuItem>}
            {!(filters.login_last_6month || filters.login_last_month || filters.login_more_than_6month) && <MenuItem value={'login_last_month'}>Last Login within last month</MenuItem>}
            {!(filters.login_last_6month || filters.login_last_month || filters.login_more_than_6month) && <MenuItem value={'login_last_6month'}>Last Login within last 6 months</MenuItem>}
            {!(filters.login_last_6month || filters.login_last_month || filters.login_more_than_6month) && <MenuItem value={'login_more_than_6month'}>Last Login More than 6 months ago</MenuItem>}
            {!(filters.under_12 || filters.under_18 || filters.over_18) && <MenuItem value={"under_12"}>Younger than 12 y/o</MenuItem>}
            {!(filters.under_12 || filters.under_18 || filters.over_18) && <MenuItem value={"under_18"}>Younger than 18 y/o</MenuItem>}
            {!(filters.under_12 || filters.under_18 || filters.over_18) && <MenuItem value={"over_18"}>Older than 18 y/o</MenuItem>}
          </Select>
        </FormControl>
        <Button onClick={on_add_filter}> Add Filter</Button>
        {filters.gender_female && <Chip onDelete={on_delete_chip('gender_female')} label='Female'></Chip>}
        {filters.gender_male && <Chip onDelete={on_delete_chip('gender_male')} label="Male"></Chip>}
        {filters.login_last_6month && <Chip onDelete={on_delete_chip('login_last_6month')} label="Last 6 months"></Chip>}
        {filters.login_last_month && <Chip onDelete={on_delete_chip('login_last_month')} label="Last Month"></Chip>}
        {filters.login_more_than_6month && <Chip onDelete={on_delete_chip('login_more_than_6month')} label="More than 6 Months"></Chip>}
        {filters.over_18 && <Chip onDelete={on_delete_chip('over_18')} label="18+ y/o"></Chip>}
        {filters.under_12 && <Chip onDelete={on_delete_chip('under_12')} label="Younger than 12"></Chip>}
        {filters.under_18 && <Chip onDelete={on_delete_chip('under_18')} label="Younger than 18"></Chip>}
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