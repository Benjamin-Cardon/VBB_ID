import { Button, Container, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { props } from '../Librarian';
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
    // Go red and a note should pop up "Incorrect login", but the typed in code should not be erased.
  }

  function handle_attendance() {
    // it should go green for a moment- some kind of signal of success, and the typed in code should be erased.
  }

  function already_logged_in() {
    // it should go yellow, the code should be erased, and the note should pop up "Already logged in"
  }

  function something_wrong() {
    // a dialog box should appear and notify the user that something is going wrong with the website- please notify web administrator (potentially benji)
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