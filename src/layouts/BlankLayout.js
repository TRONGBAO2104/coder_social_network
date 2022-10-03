import { Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";

function BlankLayout() {
  return (
    <Stack minHeight="100vh" justifyContent="center" alignItems="center">
      <Logo sx={{ width: 120, height: 120, mb: 5 }} disableLink={true} />
      <Outlet />
    </Stack>
  );
}

export default BlankLayout;
