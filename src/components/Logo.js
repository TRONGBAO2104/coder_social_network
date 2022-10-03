import React from "react";
import { Link as RounterLink } from "react-router-dom";
import { Box } from "@mui/material";
import logoImg from "../logo.png";

function Logo({ disableLink = false, sx }) {
  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src={logoImg} alt="logo" width="100%" />
    </Box>
  );

  if (disableLink) {
    return logo;
  }

  return <RounterLink to="/">{logo}</RounterLink>;
}

export default Logo;
