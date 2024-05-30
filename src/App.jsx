import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import apiUrl from "../systemVariable";

const App = (props) => {
  const [uploadedPhoto, setUploadedPhoto] = useState(false); 
  const [loginUser, setLoginUser] = useState(null);
  const [cookieUser, setCookieUser] = useState()
//get cookie
  useEffect(()=>{
    const userIdCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_id='))
    ?.split('=')[1];
    if(userIdCookie){
      setCookieUser(userIdCookie)
    }
    console.log("haha")
  })
  
//fetch user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl.api}/api/user/${cookieUser}`, {credentials: "include", withCredentials: true}
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setLoginUser(result[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [cookieUser]);

  const handleLoginUserChange = user => {
    setLoginUser(user);
  };  

  const handlePhotoUpload = () => {
    setUploadedPhoto(!uploadedPhoto);  
  };

  return (
      <Router>
        <div className='roott'>
          <Grid container>
            <Grid item xs={12} className="topbar-sticky" >
              <TopBar 
                onLoginUserChange={handleLoginUserChange} 
                onPhotoUpload={handlePhotoUpload} 
                loginUser={loginUser}
                
              />
            </Grid>
              {!!loginUser && (<Grid item sm={2}>
                <Paper className="main-grid-item">
                  <UserList loginUser={loginUser} />
                </Paper>
              </Grid>)}
            <Grid item sm={!!loginUser ? 10 : 12} >
              <div className="main-grid-item ">
                  <Routes>
                    <Route
                        path={"/login-register"}
                        element = {<LoginRegister onLoginUserChange={handleLoginUserChange} loginUser={loginUser}/>}
                    /> 
                    <Route
                        path={"/users/:userId"}
                        element = {<UserDetail 
                          loginUser={loginUser} 
                        />}
                    />
                    <Route
                        path="/photos/:userId"
                        element = {<UserPhotos 
                          loginUser={loginUser}
                          photoIsUploaded={uploadedPhoto}/>}
                    />
                    <Route path="/users" element={<UserList loginUser={loginUser}/>} />
                    <Route path="/*" element = {<LoginRegister onLoginUserChange={handleLoginUserChange} loginUser={loginUser}/>} />
                  </Routes>            
              </div>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;
