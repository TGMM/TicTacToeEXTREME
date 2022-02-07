import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Button, Alert, Snackbar } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import SkinUploadDialog, { SkinType } from "./SkinUploadDialog";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

function getKeyByValue<T>(object: T, value: T[keyof T]) {
  return Object.keys(object).find(key => {
    return object[key as keyof T] === value;
  });
}

export default function Skins() {
  const [open, setOpen] = React.useState(false);
  const [sbOpen, setSbOpen] = React.useState(false);
  const [skins, setSkins] = React.useState(new Array<any>());

  const handleUseSkin = async (event: React.MouseEvent<HTMLElement>) => {
    const skinId = event.currentTarget.dataset.id;
    if(skinId === undefined) return;

    const result = await axios.patch(`${process.env.REACT_APP_API_URL}/api/userSkins`, { skinId }, 
      {withCredentials: true});
    
    if(result.status != 200) return;
    setSbOpen(true);
  };

  const handleDeleteSkin = async (event: React.MouseEvent<HTMLElement>) => {
    const skinId = event.currentTarget.dataset.id;
    if(skinId === undefined) return;
    const result = await axios.delete(`${process.env.REACT_APP_API_URL}/api/skin/${skinId}`, {withCredentials: true});

    updateSkins();
    if(result.status != 200) return;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    updateSkins();
  };

  const handleSbClose = () => {
    setSbOpen(false);
  };

  const fetchSkins = async () => {
    const skins = await fetch(`${process.env.REACT_APP_API_URL}/api/skin`);
    const skinArr: any[] = await skins.json();

    setSkins(skinArr);
  };

  const updateSkins = () => {
    fetchSkins().catch(console.error);
  };

  useEffect(updateSkins, [setSkins]);

  const tokenCookie = Cookies.get("token");
  const jwt = tokenCookie ? jwt_decode(tokenCookie) as {userId?: string} : undefined;
  const userId = jwt && "userId" in jwt ? jwt["userId"] : undefined;

  return (
    <div>
      <Box sx={{display: "flex", justifyContent: "center", margin: "15px 0"}}>
        <Button sx={{height: "min-content"}} variant="contained" onClick={handleClickOpen}>
          Upload
        </Button>
      </Box>
      <Box sx={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
        {skins.map((skin, i) => 
          <Card sx={{ maxWidth: 345, height: "min-content" }} key={i}>
            <CardActionArea disableRipple>
              <CardMedia
                component="img"
                height="140"
                image={skin.url}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  {skin.title}
                </Typography>
                <Typography gutterBottom variant="caption" component="div" align="center">
                  {getKeyByValue(SkinType, skin.type)}
                </Typography>
                <Typography gutterBottom variant="h6" component="div" align="center">
                  By: {skin.author.email}
                </Typography>
                <Box display="flex" justifyContent="space-around">
                  <Button data-id={skin._id} onClick={handleUseSkin} variant="outlined">Use</Button>
                  {
                    userId == skin.author._id ? <Button data-id={skin._id} onClick={handleDeleteSkin} variant="outlined" color="error">Delete</Button> : null
                  }
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        )}
        <SkinUploadDialog
          open={open}
          onClose={handleClose}
        />
        <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
          <Alert onClose={handleSbClose} severity="success" sx={{ width: "100%" }}>
            Succesfully set skin!
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}