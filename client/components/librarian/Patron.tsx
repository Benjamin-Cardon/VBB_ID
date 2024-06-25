import React from "react";
import { useState } from "react";
import { Box, IconButton, Paper, Stack, Typography, Container } from "@mui/material";
import { patron } from "../../types";
import { KeyboardArrowDown } from "@mui/icons-material";
function Patron({ patron }: { patron: patron }) {
  const [expanded, setExpanded] = useState(false);
  const on_expand = () => {
    setExpanded(!expanded);
  }
  return (
    <Paper>
      <Box>
        <Stack direction='row' spacing='2' >
          <Typography>{patron.profile.first_name + ' ' + patron.profile.last_name}</Typography>
          <IconButton onClick={on_expand} sx={{ justifyContent: 'flex-end' }} >
            <KeyboardArrowDown />
          </IconButton>
        </Stack>
      </Box>
      {expanded && <Container>
        <Typography>Patron has a library ID of : {patron.patron_id}</Typography>
        <Typography>TODO: Display other user information as profile here.</Typography>
      </Container>}
    </Paper>
  );
}
export default Patron;

