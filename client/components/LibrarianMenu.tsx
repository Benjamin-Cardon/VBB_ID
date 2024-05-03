import { Button } from "@mui/material";
import React from "react";

function LibrarianMenu() {
  let on_navigate = (destination: string): void => {

  }

  return (<div>
    <div>
      <Button>Attendance</Button>
      <Button>Register</Button>
      <Button>Log Out</Button>
    </div>
  </div>)
}

export default LibrarianMenu