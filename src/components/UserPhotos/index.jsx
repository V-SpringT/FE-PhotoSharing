import React, { useState, useEffect } from "react";
import {
  Divider,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Link
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../../systemVariable.js";


function UserPhotos(props) {
  let navigate = useNavigate();
  const userid = useParams().userId;
  //-----------fetch API-------------------
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const[photoId,setPhotoId] = useState([]);
  const [newComment, setNewComment] = useState();
  const [deletedCmt, setDeletedCmt] = useState(false);
  const [deletedPhoto, setDeletedPhoto] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, photoData] = await Promise.all([
          fetchUserData(),
          fetchPhotoData(),
        ]);
        setUser(userData);
        setData(photoData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
      }
    };
    fetchData();
  }, [ props.photoIsUploaded,deletedPhoto,deletedCmt,newComment, userid]);

  //User fetch
  const fetchUserData = async () => {
    const response = await fetch(
      `${apiUrl.api}/api/user/${userid}`,
      { credentials: "include", withCredentials: true },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };
  //end user fetch

  //photo fetch
  const fetchPhotoData = async () => {
    const response = await fetch(
      `${apiUrl.api}/api/photo/photosOfUser/${userid}`,
      { credentials: "include" },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };
  //end photo fetch


  // function event

  //delete comment
  const handleCommentDetele = (cmt, pt) => {
    axios
      .delete(
        `${apiUrl.api}/api/photo/commentsOfPhoto/delete/${pt}/${cmt}`,
        { credentials: "include", withCredentials: true },
      )
      .then((response) => {
        console.log("delete comment success!!");
        setDeletedCmt(!deletedCmt);
      })
      .catch((err) => console.log("Comment Sent Failure: ", err));
  };

  // delete photo
  const handlePhotoDelete = (photo_id) => {
    axios
    .delete(
      `${apiUrl.api}/api/photo/delete/${photo_id}`,
      { credentials: "include", withCredentials: true },
    )
    .then((response) => {
      console.log("delete photo success!!");
      setDeletedPhoto(!deletedPhoto);
    })
    .catch((err) => console.log("photo Sent Failure: ", err));
  };

  //submit comment
  const handleCommentSubmit = () => {
    const txtCmt = comment;
    setComment("");
    setOpen(false);
    axios
      .post(
        `${apiUrl.api}/api/photo/commentsOfPhoto/${photoId}`,
        { cmt: txtCmt, photo_id: photoId },
        { credentials: "include", withCredentials: true },
      )
      .then((response) => {
        console.log("add comment success!!");
        setNewComment(response.data);
      })
      .catch((err) => console.log("Comment Sent Failure: ", err));
  };


  //open dialog comment
  const handleClickOpen = (photoid) => {
    setPhotoId(photoid)
    setOpen(true);
  };

  //close dialog comment
  const handleClickClose = () => {
    setPhotoId(null);
    setOpen(false);
  };
  //fortmart
  const formartDateTime = (s) => {
    const date = new Date(s);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const curUser = user[0];

  // giao dien

  if (curUser && data.length > 0 && props.loginUser) {
    {console.log("tesst data", data[0].comments)}
    return (
      <Grid container justifyContent="flex-start" >
        {data.map((photo) => (
          <Grid item xs={4} >
            {/* post layout  */}
            <Card style={{ borderRadius: "14px", border: "2px solid #444444", margin:'10px' }}>
              <CardHeader
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: "#5E91F8",
                      border: "2px solid #222222",
                    }}
                  >
                    {curUser.first_name[0]}
                  </Avatar>
                }
                title={
                  <Typography>{`${curUser.first_name} ${curUser.last_name}`}</Typography>
                }
                subheader={formartDateTime(photo.date_time)}
                action={
                  props.loginUser._id === curUser._id && (
                    
                    // Button delete photo
                    <IconButton
                      title="Remove the photo"
                      onClick={() => handlePhotoDelete(photo._id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  )
                }
              />
              {/* postContent  */}

              <Typography variant="subtitle1" style={{ margin: "5px 10px", marginTop: '0px' }}>
                {photo.post_content}
              </Typography>

              {/* img */}
              <CardMedia
                style={{ objectFit: "contain", width: '100%', height:'auto' }}
                component="img"
                image={photo.file_name}
                alt=""
              />

              {/* Comment layout */}
              <CardContent style={{ paddingTop: "0" }}>
                {photo.comments && (
                  <Typography
                    variant="subtitle1"
                    style={{ marginBottom: "5px" }}
                  >
                    Comments:
                    <Divider />
                  </Typography>
                )}
                {photo.comments.length>0 && (photo.comments.map((c) => (
                  <div key={photo._id} style={{ marginBottom: "10px" }}>
                    {c.user &&(<Link
                      onClick={() => navigate(`/users/${c.user._id}`)}
                      variant="subtitle2"
                      style={{ marginRight: "5px",  cursor: 'pointer' }}
                    >
                      (<b style={{ fontSize: "14px" }}>
                        {`${c.user.first_name} ${c.user.last_name}`}
                      </b>)
                    </Link> )}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      gutterBottom
                    >
                      <b>{formartDateTime(c.date_time)}</b>

                      {/* Delete comment*/}

                      {props.loginUser._id == c.user_id && (
                        <IconButton
                          title="Delete the comment"
                          onClick={() => handleCommentDetele(c._id, photo._id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      )}


                    </Typography>

                    <Typography variant="body1">
                      {`"${c.comment}"`}
                      <Divider />
                    </Typography>
                  </div>
                )))}
                {/* new comment */}

                <div className="comment-dialog">
                  <Chip
                    label="Reply"
                    onClick={()=>handleClickOpen(photo._id)}
                    style={{
                      backgroundColor: "#abd1c6",
                      border: "1px solid black",
                    }}
                  />
                </div>

                <Dialog open={open} onClose={handleClickClose}>
                  <DialogContent>
                    <DialogContentText>Bình luận</DialogContentText>
                    <TextField
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      autoFocus
                      multiline
                      margin="dense"
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClickClose}>Cancel</Button>
                    <Button
                      onClick={(e) => handleCommentSubmit()}
                      style={{
                        backgroundColor: "#79CFF5",
                        border: "1px solid black",
                      }}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
}
export default UserPhotos;
