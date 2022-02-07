import React from "react";
import { Box, Button, Dialog, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import axios from "axios";

export interface SkinUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SkinType = {
  Board: 0,
  Cross: 1,
  Nought: 2
} as const;

export default function SkinUploadDialog(props: SkinUploadDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const [currentSkinType, setCurrentSkinType] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentSkinType(event.target.value as string);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = data.get("type");
    const formData = {
      type: type ? +type : null,
      title: data.get("title"),
      url: data.get("url")
    };

    console.log(formData);
    const result = await axios.post(`${process.env.REACT_APP_API_URL}/api/skin`, formData, {withCredentials: true});
    if(result.status == 200) handleClose();
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ width: 500, height: 500, display: "flex", 
        flexDirection: "column", justifyContent: "space-around", 
        alignItems: "center" }} component="form" onSubmit={handleSubmit} noValidate>
        <FormControl sx={{width: "45%"}}>
          <InputLabel id="skin-type-select-label">Skin Type</InputLabel>
          <Select
            labelId="skin-type-select-label"
            id="skin-type-select"
            value={currentSkinType}
            label="Skin Type"
            name="type"
            onChange={handleChange}
          >
            {Object.keys(SkinType).map((skinType, i) => {
              const st = skinType as keyof typeof SkinType;
              return <MenuItem value={SkinType[st]} key={i}>{skinType}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField label="Title" name="title"></TextField>

        <TextField label="Image URL" id="url-input" name="url"></TextField>

        <Button type="submit" variant="contained">Confirm</Button>
      </Box>
    </Dialog>
  );
}