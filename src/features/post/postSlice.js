import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { POSTS_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      // console.log("createPostSuccess", action.payload);
      state.isLoading = false;
      state.error = null;

      // After enter to push post to Server, 2 line below will
      // support to get post from Server and display on screen
      const newPost = action.payload;
      // state.posts.unshift(newPost);
      if (state.currentPagePosts.length % POSTS_PER_PAGE === 0)
        state.currentPagePosts.pop();
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    getPostSuccess(state, action) {
      // console.log("getPostSuccess", action.payload);
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        // console.log("post", post);
        if (!state.currentPagePosts.includes(post._id))
          state.currentPagePosts.push(post._id);
      });
      // state.posts = state.posts.concat(posts);
      state.totalPosts = count;
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const postId = action.payload._id;
      state.currentPagePosts = state.currentPagePosts.filter(
        (post) => post !== postId
      );
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const newPost = action.payload;
      console.log("newPost", newPost);
      state.postsById[newPost._id] = newPost;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // console.log(">>> sendPostReactionSuccess action.payload", action.payload);
      const { postId, reactions } = action.payload;
      state.postsById[postId].reactions = reactions;
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
  },
});

export default slice.reducer;

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // upload image to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      // console.log("createPost", response.data);
      dispatch(slice.actions.createPostSuccess(response.data));
      toast.success("Post successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getPosts =
  ({ userId, page = 1, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      // console.log(">>> getPosts", response);
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deletePost =
  ({ postId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.delete(`/posts/${postId}`);
      console.log("deletePost", response.data._id);
      dispatch(slice.actions.deletePostSuccess(response.data));
      // dispatch(slice.actions.deletePostSuccess({ ...response.data, postId }));
      toast.success("Delete successfully");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const editPost =
  ({ postId, content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const imageUrl = await cloudinaryUpload(image);
      const data = { content, image: imageUrl };
      const response = await apiService.put(`/posts/${postId}`, data);
      dispatch(slice.actions.editPostSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/reactions", {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
