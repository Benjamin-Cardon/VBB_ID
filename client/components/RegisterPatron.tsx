import React from "react";
import { useState } from "react";
import { TextField, FormControl, RadioGroup, Radio, FormLabel, FormControlLabel, Select, Button } from "@mui/material";
function RegisterPatron() {
  const [form_state, set_form_state] = useState({});
  const [has_portal, set_has_portal] = useState(false);
  const [portal_form, set_portal_form] = useState({});

  void function get_portal() {

  }

  void function register() {

  }

  void function change_state() {

  }

  return (<div><div>
    <TextField>What's your first name?</TextField>
    <TextField>What's your last name?</TextField>
    <FormControl>
      <FormLabel>What's your gender?</FormLabel>
      <RadioGroup>
        <FormControlLabel value='female' control={<Radio />} label='Female' />
        <FormControlLabel value='male' control={<Radio />} label='Male' />
      </RadioGroup>
    </FormControl>
    <TextField> What is your date of birth? </TextField>
    <Select>What grade are you in?</Select>
    <Select>Including yourself, how many family members do you have living in your home?</Select>
    <FormControl>
      <FormLabel>What is your current family status?</FormLabel>
      <Select></Select>
    </FormControl>
    <FormControl>
      <FormLabel>How many members of your family have jobs that provide income?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>What are the main obstacles or challenges that have prevented you from continuing or completing your education?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>How would you rate the level of support you receive from your family?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>Which subject do you enjoy the most in school?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>What subject do you believe will be most useful for your future career?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>What subject do you find most difficult in school and need help with?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>How did you hear about our library?</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel>What additional resources or services would you like to see in the library? multiple choices</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <FormControl>
      <FormLabel> What do you expect to achieve from using our library? multiple choices</FormLabel>
      <RadioGroup>
        <FormControlLabel value={0} control={<Radio />} label='0' />
      </RadioGroup>
    </FormControl>

    <Button>Submit</Button>

  </div></div>)
}

export default RegisterPatron