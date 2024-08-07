import React from "react";
import { useState, useEffect } from "react";
import { props } from "../Librarian";
import { Button, Box, Container, TextField, Typography, Pagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Patron from "./Patron";
import { patron } from "../../types";
import { useAuth } from "./AuthContext";
import MentorshipConnectModal from "./mentorship_components/MentorshipConnectModal";
import { mentorship_info } from "./mentorship_components/MentorshipConnectModal";
const patron_dummy: patron = {
  patron_id: "Yahoo",
  last_login: null,
  count_logins: 0,
  profile: {
    first_name: "Johnny",
    last_name: "Appleseed",
    gender: "male",
    grade_level: '6',
    library_attendance_goal: ['Utilize a quiet space for studying'],
    date: null,
    family_members_with_income: '3 or more',
    family_members: '10 or More',
    family_status: 'Orphaned (both parents deceased)',
    family_support_level: '5',
    favorite_subject: 'Sciences: Biology, Chemistry, Physics, and advanced sciences.',
    barriers_to_education: ['Family Responsibilities: Need to work or take care of siblings'],
    percieved_most_difficult_subject: 'Mathematics',
    percieved_most_useful_subject: 'Sciences: Biology, Chemistry, Physics, and advanced sciences.',
    library_discovery_method: 'Community outreach',
    library_travel_time: 'More than 4 hours',
    desired_library_resource: ['Art supplies'],
  }
}

function Patrons(patron_props: props) {
  const session_id = useAuth().session_id;
  const [search_text, set_search_text] = useState('');
  const [fetched_patrons, set_fetched_patrons] = useState([] as patron[])
  const [filtered_patrons, set_filtered_patrons] = useState([] as patron[])
  const [displayed_patrons, set_displayed_patrons] = useState([patron_dummy] as patron[]);
  const [page, setPage] = useState(0);
  const [page_count, set_page_count] = useState(0);
  const [orderby, setOrder] = useState('First Name');
  const [mentorship_modal_open, set_mentorship_modal_open] = useState(false);
  const [handle_select, set_handle_select] = useState(() => (patron: mentorship_info) => { })

  useEffect(() => {
    fetch(`http://localhost:3000/patrons/list?session=${session_id}`)
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
          let patrons = JSON.parse(stringified_body)
          set_fetched_patrons(patrons);
          set_filtered_patrons(patrons);
          setPage(1);
          set_displayed_patrons(filtered_patrons.slice((page - 1) * 10, page * 10 < filtered_patrons.length ? page * 10 : filtered_patrons.length))
          set_page_count(patrons.length ? Math.ceil(patrons.length / 10) : 1);
        }
      })
      .catch(error => {
        console.error('Error reading stream:', error);
      });
  }, []);

  useEffect(() => {
    set_displayed_patrons(filtered_patrons.slice((page - 1) * 10, page * 10 < filtered_patrons.length ? page * 10 : filtered_patrons.length))
  }, [page])

  let update_fetched_patrons = (patron: patron) => {
    let new_fetched = [...fetched_patrons];
    let ind = new_fetched.findIndex((patr) => patron.patron_id == patr.patron_id);
    new_fetched[ind] = patron;
    set_fetched_patrons(new_fetched);
  }

  let on_search_patrons = function () {
    let patrons = fetched_patrons.filter((patron) => {
      let name = (patron.profile.first_name + " " + patron.profile.last_name).trim().toLowerCase();
      let searched = search_text.trim().toLowerCase();
      return name.includes(searched)
    })

    if (orderby == 'First Name') {
      patrons.sort((a: patron, b: patron) => {
        return a.profile.first_name.localeCompare(b.profile.first_name);
      })
    } else if (orderby == 'Last Name') {
      patrons.sort((a: patron, b: patron) => {
        return a.profile.last_name.localeCompare(b.profile.last_name);
      })
    } else if (orderby == 'Count Attendance') {
      patrons.sort((a: patron, b: patron) => {
        return Number(b.count_logins) - Number(a.count_logins)
      })
    } else if (orderby == 'Time Last Attended (Recent)') {
      patrons.sort((a: patron, b: patron) => {
        //TODO FIX
        if (!a.last_login && !b.last_login) {
          return 0;
        }
        if (!a.last_login) {
          return -1;
        }
        if (!b.last_login) {
          return 1;
        }
        console.log(Date.parse(b.last_login.slice(0, 10)) - Date.parse(a.last_login.slice(0, 10)));
        return Date.parse(b.last_login.slice(0, 10)) - Date.parse(a.last_login.slice(0, 10));
      })
    } else if (orderby == 'Time Last Attended (Far)') {
      patrons.sort((a: patron, b: patron) => {
        if (!a.last_login && !b.last_login) {
          return 0;
        }
        if (!a.last_login) {
          return 1;
        }
        if (!b.last_login) {
          return -1;
        }
        return Date.parse(a.last_login.slice(0, 10)) - Date.parse(b.last_login.slice(0, 10));
      })
    }

    set_filtered_patrons(patrons);
    setPage(1);
    set_displayed_patrons(patrons.slice((page - 1) * 10, page * 10 < patrons.length ? page * 10 : patrons.length))
  }

  function on_page_change(event: React.ChangeEvent<unknown>, page: number) {
    setPage(page);
  }
  function on_close_mentorship() {
    set_mentorship_modal_open(false);
  }
  const on_change_display = (patrons: Array<patron>) => {
    set_displayed_patrons(patrons);
  }
  function update_display_on_select(mentorship_patron: mentorship_info, patron: patron) {
    const new_displayed = displayed_patrons.map((val: patron) => {
      if (val.patron_id == patron.patron_id) {
        console.log("WE FOUND IT", val, mentorship_patron)
        return { ...patron, profile: { ...patron.profile, mentorship_user_id: mentorship_patron.user_id } };
      }
      return val
    })
    console.log("New Displayed Patrons", new_displayed)
    on_change_display(new_displayed);
  }

  function handle_select_creator(patron: patron) {
    return () => (mentorship_patron: mentorship_info) => {
      fetch("http://localhost:3000/patrons/update_info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ modified_patron_profile: { ...patron, profile: { ...patron.profile, mentorship_user_id: mentorship_patron.user_id } }, session_id })
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
            on_close_mentorship();
            update_display_on_select(mentorship_patron, patron);
          } else {
            console.log("No auth success. ")
          }
        }
      })


    }
  }

  function open_mentorship_creator(patron: patron) {
    return () => {
      set_handle_select(handle_select_creator(patron))
      set_mentorship_modal_open(true);
    }
  }


  return (<Box>
    <Box>
      <Button onClick={(e) => { patron_props.changePage('LibrarianMenu') }}>Main Menu</Button>
    </Box>
    <MentorshipConnectModal session_id={session_id != undefined ? session_id : ""} open_state={mentorship_modal_open} close={on_close_mentorship} select_patron={handle_select}></MentorshipConnectModal>
    <Container>
      <Typography />
      <TextField label="Search Name" value={search_text} onChange={(e) => { set_search_text(e.target.value) }} />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Order By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={orderby}
          label="Order By"
          onChange={(e) => { setOrder(e.target.value) }}
        >
          <MenuItem value={'First Name'}>First Name</MenuItem>
          <MenuItem value={'Last Name'}>Last Name</MenuItem>
          <MenuItem value={'Count Attendance'}>Count Attendance</MenuItem>
          <MenuItem value={'Time Last Attended (Recent)'}>Time Last Attended (Recent)</MenuItem>
          <MenuItem value={'Time Last Attended (Far)'}>Time Last Attended (Far)</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={on_search_patrons}>Search</Button>
    </Container>
    <Container>
      {displayed_patrons.map((patron) => {
        return (<Patron patron_prop={patron} update_fetched={update_fetched_patrons} open_mentorship={open_mentorship_creator(patron)} />)
      })}
      <Pagination count={page_count} page={page} onChange={on_page_change} />
    </Container>
  </Box>);
}

export default Patrons
























