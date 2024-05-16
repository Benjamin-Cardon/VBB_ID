import { Button, Container, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { props } from '../App';
import { useAuth } from './AuthContext';
function PatronLogin(patron_props: props) {
  let session_id = useAuth().session_id;
  const [code, set_code] = useState('');
  const [resp, set_resp] = useState('');

  function on_patron_login(): void {
    fetch("http://localhost:3000/attendance/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, session_id })
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
        set_resp(stringified_body)
        if (stringified_body == "No such code.") {
          incorrect_code()
        } else if (stringified_body == "Patron Logged in") {
          handle_attendance()
        } else if (stringified_body == "This person is already logged in for today!") {
          already_logged_in()
        } else if (stringified_body == "Something went wrong") {
          something_wrong()
        } else {
          something_wrong()
        }
      }
    })
  };

  function incorrect_code() {

  }

  function handle_attendance() {

  }

  function already_logged_in() {

  }

  function something_wrong() {

  }

  return <div style={{ height: "90vh" }}>
    <Button onClick={() => { patron_props.changePage('LibrarianMenu') }} >Main Menu </Button>
    <Container maxWidth='sm' style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '70%',
      justifyContent: 'center',
    }}>
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <TextField value={code} onChange={(e) => { set_code(e.target.value) }}>Patron id</TextField>
        <Button onClick={on_patron_login}>Log in</Button>
        <p>{resp}</p>
      </Stack>
    </Container>
  </div>
}

export default PatronLogin