import { useState, useEffect } from 'react';
import React from 'react';
import { TextField, InputLabel, MenuItem, FormControl, Select, Button, SelectChangeEvent } from '@mui/material';
import { login_state } from '../types';
import { ChangeEvent } from 'react';

let libraries = ['Adeiso', 'Ahero', 'Maragoli', 'Biwi', 'Dzaleka', 'Kadzakalowa', 'Namalimwe', 'Charity Centre', 'High Tech', 'Mukono', "Little Flower", "Jollyland", "Sankubanase", "Cuchapa", "Darwin"]
type library = {
  name: string,
  id: string,
  country: string,
  notes: null | string,
  poBoxNumber: null | string,
  postal_code: string,
  state_province: string,
}
function LibrarianLogin() {
  let obj: login_state = { password: '', username: '', library: '' };
  let lib: Array<library> = [];
  const [form_state, set_form_state] = useState(obj)
  const [libraries, set_libraries] = useState(lib);
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
        }
      } else if (input == "username") {
        if (e.target.value) {
          set_form_state({ ...form_state, username: e.target.value })
        }
      }
    }
  }
  function on_select_change(e: SelectChangeEvent) {
    set_form_state({ ...form_state, library: e.target.value })
  }

  void function on_submit_login() {

  }
  return (<div><div>
    <TextField variant='outlined' value={form_state.username} onChange={on_form_change('username')}>Username</TextField>
    <TextField variant='outlined' value={form_state.password} onChange={on_form_change('password')}>Password</TextField>
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
    <Button>Log in</Button>
  </div>
  </div>)
}

export default LibrarianLogin;