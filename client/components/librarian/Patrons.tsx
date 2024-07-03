import React from "react";
import { useState, useEffect } from "react";
import { props } from "../Librarian";
import { Button, Box, Container, TextField, Typography, Pagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Patron from "./Patron";
import { patron } from "../../types";
import { useAuth } from "./AuthContext";
import { ImageNotSupportedSharp } from "@mui/icons-material";
import dayjs from "dayjs";
const patron_dummy: patron = {
  patron_id: "Yahoo",
  last_login: null,
  count_logins: 0,
  profile: {
    first_name: "Johnny",
    last_name: "Appleseed",
    gender: "male",
    grade_level: '6',
    library_attendance_goal: 'Utilize a quiet space for studying',
    date: null,
    family_members_with_income: '3 or more',
    family_members: '10 or More',
    family_status: 'Orphaned (both parents deceased)',
    family_support_level: '5',
    favorite_subject: 'Sciences: Biology, Chemistry, Physics, and advanced sciences.',
    barriers_to_education: 'Family Responsibilities: Need to work or take care of siblings',
    percieved_most_difficult_subject: 'Mathematics',
    percieved_most_useful_subject: 'Sciences: Biology, Chemistry, Physics, and advanced sciences.',
    library_discovery_method: 'Community outreach',
    library_travel_time: 'More than 4 hours',
    desired_library_resource: 'Art supplies',
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

  useEffect(() => {
    console.log("Used Effect")
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
    console.log(filtered_patrons)
  }, [page])


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

  return (<Box>
    <Box>
      <Button onClick={(e) => { patron_props.changePage('LibrarianMenu') }}>Main Menu</Button>
    </Box>
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
        return (<Patron patron={patron} />)
      })}
      <Pagination count={page_count} page={page} onChange={on_page_change} />
    </Container>
  </Box>);
}

export default Patrons
























