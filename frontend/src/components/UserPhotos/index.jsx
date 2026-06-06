import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Link as RouterLink,
  useParams,
} from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import formatDateTime from "../../lib/formatDateTime";
import imageUrlFromFileName from "../../lib/imageFromFileName";

function CommentBlock({ comment }) {
  const author = comment.user;
  const authorName = author
    ? `${author.first_name} ${author.last_name}`
    : "Unknown user";
  const authorId = author && author._id;

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {formatDateTime(comment.date_time)}
      </Typography>
      <Typography variant="body2" component="span">
        {authorId ? (
          <Link component={RouterLink} to={`/users/${authorId}`}>
            {authorName}
          </Link>
        ) : (
          authorName
        )}
        {": "}
        {comment.comment}
      </Typography>
    </Box>
  );
}

function PhotoCard({ photo, onAddComment }) {
  const src = imageUrlFromFileName(photo.file_name);
  const comments = Array.isArray(photo.comments) ? photo.comments : [];
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = comment.trim();

    if (!trimmed) {
      setSubmitError("Comment cannot be empty.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await onAddComment(photo._id, trimmed);
      setComment("");
    } catch (err) {
      setSubmitError(err.message || "Could not add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      {src ? (
        <CardMedia
          component="img"
          image={src}
          alt={photo.file_name || "User photo"}
          sx={{ maxHeight: 480, objectFit: "contain", bgcolor: "grey.100" }}
        />
      ) : (
        <Box sx={{ p: 2, bgcolor: "grey.200" }}>
          <Typography variant="body2" color="text.secondary">
            Missing image: {photo.file_name}
          </Typography>
        </Box>
      )}
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {formatDateTime(photo.date_time)}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Comments
        </Typography>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {comments.map((c) => (
              <CommentBlock key={c._id} comment={c} />
            ))}
          </Stack>
        )}
        <Box
          component="form"
          className="user-photos-comment-form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Add a comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            fullWidth
            multiline
            minRows={2}
            size="small"
            disabled={submitting}
            error={Boolean(submitError)}
            helperText={submitError || " "}
          />
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function UserPhotos() {
  const { userId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setPhotos([]);
    setError(null);
    setLoading(true);
    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => {
        if (!cancelled) {
          setPhotos(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || String(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const addComment = async (targetPhotoId, commentText) => {
    const newComment = await fetchModel(`/commentsOfPhoto/${targetPhotoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: commentText }),
    });

    setPhotos((previousPhotos) =>
      previousPhotos.map((photo) =>
        photo._id === targetPhotoId
          ? {
              ...photo,
              comments: [...(photo.comments || []), newComment],
            }
          : photo
      )
    );
  };

  if (error) {
    return (
      <Typography color="error" variant="body1">
        Could not load photos: {error}
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
        <CircularProgress size={28} />
        <Typography variant="body2">Loading photos…</Typography>
      </Box>
    );
  }

  if (photos.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        This user has not uploaded any photos.
      </Typography>
    );
  }

  return (
    <Box>
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} onAddComment={addComment} />
      ))}
    </Box>
  );
}

export default UserPhotos;
