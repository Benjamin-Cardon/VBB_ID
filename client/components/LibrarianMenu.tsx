import { Button, Card, CardActions, Container, Stack } from "@mui/material";
import React from "react";
import { props } from "../App";
import { useAuth } from "./AuthContext";
function LibrarianMenu(menu_props: props) {
  let on_navigate = (destination: string): void => {
    menu_props.changePage(destination);
  }
  const auth = useAuth();
  console.log("We got to menu with auth:", auth.session_id);

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
      </Container>



    </div>
  </div>)
}

export default LibrarianMenu