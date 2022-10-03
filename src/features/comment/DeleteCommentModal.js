import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

import { deleteComment } from "./commentSlice";

export default function DeleteCommentModal({
  comment,
  openDeleteModal,
  setOpenDeleteModal,
}) {
  const handleDeleteOpen = () => setOpenDeleteModal(true);
  const handleDeleteClose = () => setOpenDeleteModal(false);

  const dispatch = useDispatch();
  const handleDeletePost = () =>
    dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));

  return (
    <Dialog
      open={handleDeleteOpen}
      onClose={handleDeleteClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"You want to delete this comment?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Stack spacing={2} sx={{ p: 1 }}>
            <Typography>{comment.content}</Typography>
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
