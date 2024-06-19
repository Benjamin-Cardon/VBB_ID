import React from "react";
import { useState } from "react";
import { Box, Button, IconButton, Paper, Stack, Typography, } from "@mui/material";
import { patron } from "../types";
import { KeyboardArrowDown } from "@mui/icons-material";
function Patron({ patron }: { patron: patron }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper>
      {expanded && <Box>
        <Stack>
          <Typography>{patron.profile.first_name + ' ' + patron.profile.last_name}</Typography>
          <IconButton>
            <KeyboardArrowDown />
          </IconButton>
        </Stack>
      </Box>}
      {!expanded && <div></div>}
    </Paper>
  );
}
export default Patron;

