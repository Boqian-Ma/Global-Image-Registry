import Button from "@mui/material/Button";
// import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import React, {useState, useEffect } from 'react';


function GIRImageCard({id, state}) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [ipfsAddr, setIpfsAddr] = useState(null);
    const [owner, setOwner] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isListed, setIsListed] = useState(false);
    
   useEffect(() => {
      const initCard = async () => {
        if (!state.address) return 
        const cardDetails = await state.contracts.ImageOwnership.methods.getImageDetails(id).call({ from: state.address });
        setTitle(cardDetails.title);
        setDesc(cardDetails.description)
        const owner = await state.contracts.ImageOwnership.methods.getImageOwner(id).call({ from: state.address})
        setOwner(owner.toLowerCase());
        setIpfsAddr(cardDetails.ipfs);
        setIsApproved(await state.contracts.ImageOwnership.methods.isTokenApproved(id).call( {from: state.address }))
        setIsListed(await state.contracts.ImageOwnership.methods.isImageListed(id).call( {from: state.address }))
        console.log(cardDetails)
      }
      initCard();
   }, [id, state])
    async function purchaseImage() {

    }
    
    async function licenceImage() {

    }
    
    async function approve() {
      await state.contracts.ImageOwnership.methods.approve(state.address, id).send({ from: state.address })
      setIsApproved(await state.contracts.ImageOwnership.methods.isTokenApproved(id).call( {from: state.address }))
    }
    async function transfer() {
      // signature transfer(address from, address to, uint256 tokenId)
    }
    async function sell() {
      //need use to input sell value then 
      const price = 100;
      await state.contracts.ImageOwnership.methods.listImage(id, price).send({ from: state.address })
    }
    
    async function changePrice() {
        // function sig, (uint tokenId, uint price)
    }
    return (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ipfsAddr != null && <CardMedia
            component="img"
            image={`https://ipfs.io/ipfs/${ipfsAddr}`}
            alt="random"
          />}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography>{desc}</Typography>
            <Typography>Contract Address</Typography>
            <Typography>{owner}</Typography>
          </CardContent>
          {state.address !== owner && <CardActions>
            <Button variant="outlined" size="small" onClick={purchaseImage}>
              Purchase
            </Button>
            <Button variant="outlined" size="small" onClick={licenceImage}>
              Licence
            </Button>
          </CardActions>}
          {state.address === owner && <CardActions>
            {!isApproved && <Button variant="contained" size = "small" onClick={approve} >Approve</Button>}
            <Button variant="outlined" size="small" onClick={transfer}>
              Transfer
            </Button>
            {isApproved && <Button variant="outlined" size="small" onClick={isListed ? () => changePrice() : () => sell()}>
              {isListed ? "changePrice" : "Sell"}
            </Button>}
          </CardActions>}
        </Card>
    )
}

export default GIRImageCard;