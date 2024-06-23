import React from "react";
import { useState, useEffect } from "react";
import { props } from "../App";
import { Button, Box, Container, TextField, Typography, Pagination } from "@mui/material";
import Patron from "./Patron";
import { patron } from "../types";

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
  const [search_text, set_search_text] = useState('');
  const [fetched_patrons, set_fetched_patrons] = useState([] as patron[])
  const [displayed_patrons, set_displayed_patrons] = useState([patron_dummy] as patron[]);
  const [profile_edits, set_profile_edits] = useState({});
  const [edit_box, set_edit_box] = useState({})
  const [portal_users, set_portal_users] = useState([{}]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log("Used Effect")
    fetch("http://localhost:3000/patron/list")
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
          set_fetched_patrons(JSON.parse(stringified_body));
        }
      })
      .catch(error => {
        console.error('Error reading stream:', error);
      });
  }, []);

  void function on_search_patrons() {

  }
  void function on_open_edit() {

  }
  void function on_open_profile() {

  }
  void function get_portal_users() {

  }
  void function save_edits() {

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
      <TextField />
    </Container>
    <Container>
      {displayed_patrons.map((patron) => {
        return (<Patron patron={patron} />)
      })}
      <Pagination count={6} page={page} onChange={on_page_change} />
    </Container>
  </Box>);
}

export default Patrons
























