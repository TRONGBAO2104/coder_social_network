import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { deletePost } from "./postSlice";

export default function DeletePostModal({
  post,
  openDeleteModal,
  setOpenDeleteModal,
}) {
  const handleDeleteOpen = () => setOpenDeleteModal(true);
  const handleDeleteClose = () => setOpenDeleteModal(false);

  const dispatch = useDispatch();
  const handleDeletePost = () => dispatch(deletePost({ postId: post._id }));

  return (
    <Dialog
      open={handleDeleteOpen}
      onClose={handleDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 700 }}>
        {"You want to delete this post?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Stack spacing={2} sx={{ p: 1 }}>
            <Typography>{post.content}</Typography>

            {post.image && (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 300,
                  "& img": { objectFit: "cover", width: 1, height: 1 },
                }}
              >
                <img src={post.image} alt="post" />
              </Box>
            )}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ fontWeight: 700, color: "error.main" }}
          onClick={handleDeleteClose}
        >
          No
        </Button>
        <Button sx={{ fontWeight: 700 }} onClick={handleDeletePost} autoFocus>
          Yes, Delete it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
