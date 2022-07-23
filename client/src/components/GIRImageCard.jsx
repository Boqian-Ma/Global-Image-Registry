import Button from "@mui/material/Button";
// import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import React, {useState, useEffect } from 'react';


function GIRImageCard({id, userAddress}) {
    useEffect(() => {
        //on component mount read image from contract image array
    }, [])
    // const [title, setTitle] = useState('');
    // const [desc, setDesc] = useState('');
    // const [ipfsAddr, setIpfsAddr] = useState(null);
    const [owner, setOwner] = useState('');
    
    function purchaseImage() {

    }
    
    function licenceImage() {

    }
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            image="https://source.unsplash.com/random"
            alt="random"
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              Image Title {id}
            </Typography>
            <Typography>Description</Typography>
            <Typography>Contract Address</Typography>
            <Typography>{userAddress}</Typography>
          </CardContent>
          {userAddress !== owner && <CardActions>
            <Button variant="outlined" size="small" onClick={purchaseImage}>
              Purchase
            </Button>
            <Button variant="outlined" size="small" onClick={licenceImage}>
              Licence
            </Button>
          </CardActions>}
        </Card>
    )
}

export default GIRImageCard;