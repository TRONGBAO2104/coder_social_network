import React, { useCallback } from "react";
import { alpha, Box, Card, Modal, Stack, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, FTextField, FUploadImage } from "../../components/form";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { editPost } from "./postSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

function EditPostModal({ post, openEditModal, setOpenEditModal }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.post);

  const defaultValues = {
    content: post.content,
    image: post.image,
  };

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleOpenModal = () => setOpenEditModal(true);
  const handleCloseModal = () => setOpenEditModal(false);

  const onSubmit = (data) => {
    // console.log(post._id, data);
    const { content, image } = data;
    dispatch(editPost({ postId: post._id, content, image }));
    handleCloseModal();
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <Modal
      open={handleOpenModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Edit Post
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FTextField
                name="content"
                multiline
                fullWidth
                rows={4}
                placeholder="Share what you are thinking here..."
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />

              <FUploadImage
                name="image"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting || isLoading}
                >
                  Save
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Card>
      </Box>
    </Modal>
  );
}

export default EditPostModal;
