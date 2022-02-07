import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

export default function Profile() {
  const pictures = ["Profile","Board","Cross","Nought"];
  return (
    <Box sx={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
      {pictures.map((picture, i) => 
        <Card sx={{ maxWidth: 345, height: "min-content" }} key={i}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" align="center">
                {picture}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </Box>
  );
}