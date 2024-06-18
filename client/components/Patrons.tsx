import React from "react";
import { useState } from "react";
import { props } from "../App";
import { Button, Box, Container, TextField, Typography } from "@mui/material";
import Patron from "./Patron";

function Patrons(patron_props: props) {
  const [search_text, set_search_text] = useState('');
  const [displayed_patrons, set_displayed_patrons] = useState([{}]);
  const [profile_edits, set_profile_edits] = useState({});
  const [edit_box, set_edit_box] = useState({})
  const [portal_users, set_portal_users] = useState([{}]);
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
        return (<Patron />)
      })}
    </Container>
  </Box>);
}

export default Patrons