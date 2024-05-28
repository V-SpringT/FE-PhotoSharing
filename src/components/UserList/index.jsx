import React, { useState, useEffect } from "react";
import { useNavigate , useParams } from 'react-router-dom';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Avatar }from "@material-ui/core";
import "./styles.css";
import apiUrl from "../../../systemVariable.js";

function UserList(props) {
  let navigate = useNavigate();
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [data, setData] = useState([]);

  //-----------fetch API-------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl.api}/api/user/list`,{credentials: "include"}
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.loginUser]);
  //----------end fetch API----------------

  const handleClick = (index) => {
    setSelectedItemIndex(index);
    navigate(`/users/${data[index]._id}`);
  };

  if(props.loginUser){
    return (
      <div>
        <Typography variant="h5" style={{ color: '#1565c0', fontWeight: '600', textAlign: 'center' }}>User List</Typography>
        <List component="nav">
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem 
                onClick={() => handleClick(index)}
                sx={{
                  '&:hover': { cursor: 'pointer', backgroundColor: '#dddddd' },
                    backgroundColor: selectedItemIndex == index ? '#dddddd' : 'inherit',
                }}
              >
                <div>
                  <Avatar
                      style={{
                        backgroundColor: "#5E91F8",
                        border: "1px solid #444444",
                        width:'26px',
                        height: '26px',
                        fontSize: '16px',
                        marginRight: '10px'
                      }}
                    >
                      {item.first_name[0]}
                  </Avatar>
                </div>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" style={{ color: '#1565c0', fontWeight: '600', fontSize: '16px' }}>
                      {item.first_name + " " + item.last_name + (props.loginUser._id === item._id ? " (Me)" : "")}
                    </Typography>
                  } 
                />
              </ListItem>
              {index < data.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
