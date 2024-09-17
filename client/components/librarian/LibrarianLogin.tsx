import { useState, useEffect, FormEventHandler, FormEvent } from 'react';
import React from 'react';
import { TextField, InputLabel, MenuItem, FormControl, Select, Button, Box, SelectChangeEvent, Alert, Snackbar, Input, InputAdornment, IconButton, Paper, Typography, } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login_state } from '../../types';
import { ChangeEvent } from 'react';
import { props } from '../Librarian';
import { useAuth } from './AuthContext';
import Logo from '../../../webAssets/logo.svg';

type library = {
  name: string,
  id: string,
  country: string,
  notes: null | string,
  poBoxNumber: null | string,
  postal_code: string,
  state_province: string,
}
function LibrarianLogin(library_props: props) {
  const auth = useAuth();
  let obj: login_state = { password: '', username: '', library: '' };
  let lib: Array<library> = [];
  const [form_state, set_form_state] = useState(obj)
  const [libraries, set_libraries] = useState(lib);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("Used Effect")
    fetch("http://localhost:3000/login/libraries")
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
          set_libraries(JSON.parse(stringified_body));
        }
      })
      .catch(error => {
        console.error('Error reading stream:', error);
      });
  }, []);

  function on_form_change(input: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      if (input == "password") {
        if (e.target.value) {
          set_form_state({ ...form_state, password: e.target.value })
        } else {
          set_form_state({ ...form_state, password: "" })
        }
      } else if (input == "username") {
        if (e.target.value) {
          set_form_state({ ...form_state, username: e.target.value })
        } else {
          set_form_state({ ...form_state, username: "" })
        }
      }
    }
  }
  function on_select_change(e: SelectChangeEvent) {
    set_form_state({ ...form_state, library: e.target.value })
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const on_submit_login: FormEventHandler<HTMLButtonElement> = (event: FormEvent<HTMLButtonElement>) => {
    console.log(JSON.stringify(form_state))
    fetch("http://localhost:3000/login/attempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_state)
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
        if (stringified_body == "Incorrect Login") {
          handle_incorrect_login();
        } else {
          auth.login(stringified_body);
          library_props.changePage("LibrarianMenu");
        }
      }
    })

    function handle_incorrect_login() {
      setOpen(true)
    }
  }
  return (<div>
    <Box id="loginContainer">
      <Box
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '50px',
          height: '50px',
        }}
      ><Logo />
      </Box>
      <Paper id="loginForm">
        <Typography>Librarian Login</Typography>
        <TextField variant="outlined" value={form_state.username} onChange={on_form_change('username')}>Username</TextField>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={form_state.password}
            onChange={on_form_change('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl>
          <InputLabel id='select-library-label'>Library</InputLabel>
          <Select
            labelId='select-library-label'
            id="select-library"
            label='Library'
            value={obj.library}
            onChange={on_select_change}>
            {libraries.map((l) => <MenuItem value={l.name}>{l.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Button onClick={on_submit_login}>Log in</Button>
      </Paper>
      <Paper id="loginInfos"></Paper>
    </Box>
    <Snackbar open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}>
      <Alert severity='error'>Login Failed</Alert>
    </Snackbar>
  </div>)
}

export default LibrarianLogin;