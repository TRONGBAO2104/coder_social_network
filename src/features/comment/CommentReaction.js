import React, { useState } from "react";
import { useDispatch } from "react-redux";

import DeleteCommentModal from "./DeleteCommentModal";

import { sendCommentReaction } from "./commentSlice";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import DeleteIcon from "@mui/icons-material/Delete";

function CommentReaction({ comment }) {
  const dispatch = useDispatch();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleClick = (emoji) => {
    dispatch(sendCommentReaction({ commentId: comment._id, emoji }));
  };

  // const handleDeleteComment = () => {
  //   dispatch(deleteComment({ commentId: comment._id, postId: comment.post }));
  // };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Stack direction="row" alignItems="center">
        <IconButton
          onClick={() => handleClick("like")}
          sx={{ color: "primary.main" }}
        >
          <ThumbUpRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="body2" mr={1}>
          {comment?.reactions?.like}
        </Typography>

        <IconButton
          onClick={() => handleClick("dislike")}
          sx={{ color: "error.main" }}
        >
          <ThumbDownAltRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Typography variant="body2">{comment?.reactions?.dislike}</Typography>
      </Stack>
      <Box>
        <IconButton
          onClick={handleOpenDeleteModal}
          sx={{ color: "secondary.dark" }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      {openDeleteModal && (
        <DeleteCommentModal
          comment={comment}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}
    </Stack>
  );
}

export default CommentReaction;
