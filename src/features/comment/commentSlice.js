import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
  isLoading: false,
  error: null,
  commentsById: {},
  /** Idea for commentsById: {
   * commentId_1: {data of commentId_1}
   * commentId_2: {data of commentId_2}
   * }
   */
  commentsByPost: {},
  /** Idea for commentsByPost: {
   * postId_1: ["commentId_1", "commentId_2", "commentId_3"]
   * postId_2: ["commentId_1", "commentId_2", "commentId_3"]
   * }
   */

  totalCommentsByPost: {},
  // totalCommentsByPost: total page in 1 post

  currentPageByPost: {},
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      // state.comments = state.comments.concat[action.payload];
      // console.log("action.payload getCommentSuccess", action.payload);
      const { postId, comments, count, page } = action.payload;
      console.log("getCommentsSuccess", comments);

      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );
      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },
    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },
  },
});

export default slice.reducer;

export const createComment =
  ({ postId, content }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post("/comments", { postId, content });
      dispatch(slice.actions.createCommentSuccess(response.data));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        page: page,
        limit: limit,
      };
      const response = await apiService.get(`/posts/${postId}/comments`, {
        params,
      });
      dispatch(
        slice.actions.getCommentsSuccess({
          ...response.data,
          postId,
          page,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendCommentReaction =
  ({ commentId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Comment",
        targetId: commentId,
        emoji,
      });
      dispatch(
        slice.actions.sendCommentReactionSuccess({
          commentId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deleteComment =
  ({ commentId, postId }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.delete(`/comments/${commentId}`);
      console.log("deleteComment", response.data._id);
      dispatch(slice.actions.deleteCommentSuccess(response.data));
      dispatch(getComments({ postId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
