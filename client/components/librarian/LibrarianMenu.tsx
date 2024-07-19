import { Button, Card, CardActions, Container, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
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
  const [mentorship, setMentorship] = useState([] as Array<mentorship_info>)

  useEffect(() => {

    console.log(auth.session_id);
    fetch_mentorship_info();

  }, []);
  const fetch_mentorship_info = () => {
    fetch(`http://localhost:3000/portal/student_info?session_id=${auth.session_id}`)
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
        }
      })
      .catch(error => {
        console.error('Error reading stream:', error);
      });
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
            <Button onClick={(e) => { setOpen(true); fetch_mentorship_info(); }}>Open Modal</Button>
          </CardActions>
        </Card>
        <MentorshipConnectModal open_state={open} mentorship_students={mentorship} close={() => { setOpen(!open) }}></MentorshipConnectModal>
      </Container>
    </div>
  </div>)
}

export default LibrarianMenu