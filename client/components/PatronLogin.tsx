import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';

function PatronLogin() {
  const [code, set_code] = useState('');
  void function on_patron_login() {

  }
  return <div>
    <div>
      <TextField>Patron id</TextField>
      <Button>Log in</Button>

    </div>
  </div>
}

export default PatronLogin