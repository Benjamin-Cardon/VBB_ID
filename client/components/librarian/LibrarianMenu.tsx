import { Button, Card, CardActions, Container, Stack } from "@mui/material";
import React, { useState } from "react";
import { props } from "../Librarian";
import { useAuth } from "./AuthContext";
import { mentorship_props, mentorship_info } from "./mentorship_components/MentorshipConnectModal";
import MentorshipConnectModal from "./mentorship_components/MentorshipConnectModal";
function LibrarianMenu(menu_props: props) {
  let on_navigate = (destination: string): void => {
    menu_props.changePage(destination);
  }
  const auth = useAuth();
  console.log("We got to menu with auth:", auth.session_id);
  const [open, setOpen] = useState(false);
  const fetch_mentorship_info = () => {
    const dummy: mentorship_info = { mentorship_id: 1, last_login: "Yesterday", username: "DummyData", first_name: "John", last_name: "Doe", date_joined: "January 1st, 1970", date_of_birth: "January 1st, 1955", profile_image: "path/to/something", gender: "male", assigned_library_id: 13, bio: "Just a fake man trying to get a fake education", sessions: [{ mentor: "The sound of Silence", date: "Always", attended: false }], mentors: ["Jane Jenneric"] }
    return [dummy];
  }

  return (<div>
    <div>
      <Button onClick={(e) => { on_navigate("LibraryLogin") }}>Log Out</Button>
      <Container maxWidth='sm'>
        <Stack spacing={3}>
          <Card>
            <CardActions>
              <Button onClick={(e) => { on_navigate("PatronLogin") }}>Attendance</Button>
            </CardActions>
          </Card>
          <Card>
            <CardActions>
              <Button onClick={(e) => { on_navigate("RegisterPatron") }}>Register</Button>
            </CardActions>
          </Card>
          <Card>
            <CardActions>
              <Button onClick={(e) => { on_navigate("Patrons") }}>Patrons</Button>
            </CardActions>
          </Card>
        </Stack>
        <Card>
          <CardActions>
            <Button onClick={(e) => { setOpen(true) }}>Open Modal</Button>
          </CardActions>
        </Card>
        <MentorshipConnectModal open_state={open} mentorship_students={fetch_mentorship_info()} close={() => { setOpen(!open) }}></MentorshipConnectModal>
      </Container>



    </div>
  </div>)
}

export default LibrarianMenu