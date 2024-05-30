import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import "./styles.css";
import { Grid, Paper, Typography, TextField, Button, Snackbar } from '@material-ui/core';
import {IconButton} from "@mui/material";
import { CloseRounded } from '@material-ui/icons';
import apiUrl from "../../../systemVariable.js";

function LoginAndRegister(props) {
  //view
  const [view, setView] = useState('login')

  //login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  //register
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState();
  const [description,setDescription] = useState();
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('')

  const handleLoginUsernameChange = (event) => {
    setLoginUsername(event.target.value);
  };

  const handleLoginPasswordChange = (event) => {
    setLoginPassword(event.target.value);
  };


  const handleRegisterFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleRegisterLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleRegisterUsernameChange = (event) => {
    setRegisterUsername(event.target.value);
  };

  const handleRegisterPasswordChange = (event) => {
    setRegisterPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log('Login - Username:', loginUsername);
    console.log('Login - Password:', loginPassword);
    axios
      .post(`${apiUrl.api}/api/user/login`, {
        username: loginUsername,
        password: loginPassword
      },{
        credentials: 'include',
        withCredentials: true
      })
      .then((response) => {
        props.onLoginUserChange(response.data);
        console.log('** LoginRegister: loggin Success! **');
      })
      .catch((error) => {
        setOpenMessage(true)
        setMessage("Thông tin tài khoản không đúng!")
        console.log('** LoginRegister: loggin Fail! **');
        props.onLoginUserChange(null);
      });
  };
  const handleLogoutPromptClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenMessage(false);
    setMessage('')
  };
  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (registerPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp!")
      setOpenMessage(true)
      return;
    }

    axios
      .post(`${apiUrl.api}/api/user/register`, {
        username: registerUsername,
        password: registerPassword,
        first_name: firstName,
        last_name: lastName,
        location: location, 
        occupation: occupation,
        description: description
      },{
        withCredentials: true,
        credentials: "include"
      })
      .then((response) => {
        console.log('** LoginRegister: new User register Success! **');
        console.log(response.data)
        props.onLoginUserChange(response.data);
      })
      .catch((error) => {
        setOpenMessage("True");
        setMessage("Tài khoản đã tồn tại!")
      });
  };
  if(props.loginUser) {
    return <Navigate to={`/users/${props.loginUser._id}`} state={{ from: "/login-register" }} replace />;
  }
  return (
    <Grid justifyContent="center" container spacing={2}>
      {view === 'login' && (<Grid  item xs={6}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6" gutterBottom>
            Đăng nhập
          </Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Tên đăng nhập"
              value={loginUsername}
              onChange={handleLoginUsernameChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              value={loginPassword}
              onChange={handleLoginPasswordChange}
              required
            />
            <Button
              variant="text"
              color="primary"
              onClick={() => setView('register')}
              style={{ width: 'auto' }}
            >
              Chưa có tài khoản? Đăng kí ngay
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Đăng nhập
            </Button>

          </form>
        </Paper>
      </Grid>)}
      {view === 'register' && (<Grid item xs={6}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h6" gutterBottom>
            Đăng ký
          </Typography>
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Tên"
              value={firstName}
              onChange={handleRegisterFirstNameChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Họ đệm"
              value={lastName}
              onChange={handleRegisterLastNameChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Tên đăng nhập"
              value={registerUsername}
              onChange={handleRegisterUsernameChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              value={registerPassword}
              onChange={handleRegisterPasswordChange}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth   
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Địa điểm"
              type="location"
              value={location}
              onChange={handleLocationChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Nghề nghiệp"
              type="occupation"
              value={occupation}
              onChange={handleOccupationChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mô tả"
              type="description"
              value={description}
              onChange={handleDescriptionChange}
            />
            <Button
              variant="text"
              color="primary"
              onClick={() => setView('login')}
              style={{ width: 'auto' }}
            >
              Đã có tài khoản? Đăng nhập ngay
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Đăng ký
            </Button>
          </form>
        </Paper>
      </Grid>)}
      <Snackbar
        open={openMessage}
        onClose={handleLogoutPromptClose}
        autoHideDuration={5000}
        message={message}
        action={(
          <IconButton color="secondary" onClick={handleLogoutPromptClose}>
            <CloseRounded />
          </IconButton>
        )}
      />
    </Grid>
  );
}

export default LoginAndRegister;
