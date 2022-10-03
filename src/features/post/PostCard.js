import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";

import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import PostReaction from "./PostReaction";
import EditPostModal from "./EditPostModal";
import CommentForm from "../comment/CommentForm.js";
import CommentList from "../comment/CommentList";

import DeletePostModal from "./DeletePostModal";

function PostCard({ post, userId }) {
  const { user } = useAuth();
  console.log(user._id, userId);

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOptionMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleOptionMenuClose = () => setAnchorEl(null);

  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const menuId = "primary-search-options-menu";
  const renderOptionsMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleOptionMenuClose}
    >
      <MenuItem onClick={handleOpenDeleteModal}>
        <DeleteIcon sx={{ mr: 1 }} />
        Delete
      </MenuItem>

      <MenuItem onClick={handleOpenEditModal}>
        <EditIcon sx={{ mr: 1 }} />
        Edit
      </MenuItem>
    </Menu>
  );

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          user._id === userId && (
            <IconButton onClick={handleOptionMenuOpen}>
              <MoreVertIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )
        }
      />
      {renderOptionsMenu}

      {/* Popup window for Edit Post */}
      {openEditModal && (
        <EditPostModal
          post={post}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
        />
      )}

      {/* Popup window for Delete Post comfirm */}
      {openDeleteModal && (
        <DeletePostModal
          post={post}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}

      {/* Display Status and Image */}
      <Stack spacing={2} sx={{ p: 3 }}>
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
        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
    </Card>
  );
}

export default PostCard;
