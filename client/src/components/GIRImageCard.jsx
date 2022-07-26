import Button from "@mui/material/Button";
// import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Typography } from "@mui/material";
import React, {useState, useEffect } from 'react';
import BasicModal from "./BasicModal";


function OneInputForm({label, type, submitText, submitFunction, id}) {
  const [input, setInput] = useState(null);
  return (
    <>
      <label> {label}
        <input type={type} onChange={ev => setInput(ev.target.value)}/>
      </label>
      <Button variant="contained" onClick={() => submitFunction(id, input)}>{submitText}</Button>
    </>
  )
}

function GIRImageCard({id, state}) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [ipfsAddr, setIpfsAddr] = useState(null);
    const [owner, setOwner] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isListed, setIsListed] = useState(false);
    const [price, setPrice] = useState(0);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function initCard() {
        if (!state.address) return 
        try {
          const cardDetails = await state.contracts.ImageOwnership.methods.getImageDetails(id).call({ from: state.address });
          setTitle(cardDetails.title);
          setDesc(cardDetails.description)
          setPrice(cardDetails.price)
          const owner = await state.contracts.ImageOwnership.methods.getImageOwner(id).call({ from: state.address})
          setOwner(owner.toLowerCase());
          setIpfsAddr(cardDetails.ipfs);
        setIsApproved(await state.contracts.ImageOwnership.methods.isTokenApproved(id).call( {from: state.address }))
        setIsListed(await state.contracts.ImageOwnership.methods.isImageListed(id).call( {from: state.address }))
      } catch (err) {
        console.log("Error fetching details for card", id, err);
      }
    }
   useEffect(() => {
      initCard();
   }, [id, initCard, state])
   
    async function purchaseImage() {
      console.log("Purchase", id)
      await state.contracts.ImageOwnership.methods.buyImage(id).send({ from: state.address, value: price})
      await initCard();
    }
    // FUNCTION INCOMPLETE 
    async function licenceImage() {
      console.log("licence")
      // 
      await initCard();
    }
    
    async function approve() {
      console.log("approve")
      await state.contracts.ImageOwnership.methods.approve(state.address, id).send({ from: state.address })
      setIsApproved(await state.contracts.ImageOwnership.methods.isTokenApproved(id).call( {from: state.address }))
      await initCard();
    }
    async function transfer(id, input) {
      console.log("transfer")
      // signature transfer(address from, address to, uint256 tokenId)
      await state.contracts.ImageOwnership.methods.transferFrom(state.address, input, id).send({ from: state.address })
      await initCard();
    }
    async function sell(id, input) {
      console.log("sell")
      await state.contracts.ImageOwnership.methods.listImage(id, input).send({ from: state.address })
      await initCard();
    }
    
    async function changePrice(id, input) {
      console.log("changePrice")
        // function sig, (uint tokenId, uint price)
      await state.contracts.ImageOwnership.methods.changeListingPrice(id, input).send({ from: state.address })
      await initCard();
    }
    
    async function unlist() {
      console.log("Unlist", id)
      await state.contracts.ImageOwnership.methods.unlistImage(id).send({ from: state.address })
      await initCard();
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
            <Typography>Price: {isListed ? price : 'Not for sale'}</Typography>
            <Typography>owner: {owner.slice(0, 5)}...{owner.slice(owner.length-4, owner.length)}</Typography>
          </CardContent>
          {state.address !== owner && <CardActions>
            {isListed && <Button variant="contained" size="small" onClick={purchaseImage}>Purchase</Button>}
            <Button variant="outlined" size="small" onClick={licenceImage}>Licence</Button>
          </CardActions>}
          {state.address === owner && <CardActions>
            {!isApproved ? <Button variant="contained" size = "small" onClick={approve} >Approve</Button>
            : <>
            {!isListed && <BasicModal 
              buttonType="contained" 
              name="Transfer" 
              Component={
                <OneInputForm 
                label="Transfer address" 
                type="text" 
                submitText="Transfer" 
                submitFunction={transfer} id={id} 
                />
              } 
              title="Transfer image to another address"
              />}
              </>
              }
            {isApproved && <>
            {!isListed ? <BasicModal 
              buttonType="outlined" 
              name="Sell" 
              Component={
                <OneInputForm 
                  label="Sell price" 
                  type="number" 
                  submitText="List image" 
                  submitFunction={sell} id={id} 
                />
              } 
              title="List image for sale"
            />
            :
            <>
            <BasicModal 
              buttonType="contained" 
              name="Change price" 
              Component={
                <OneInputForm 
                label="New Price" 
                type="number" 
                submitText="Update price" 
                submitFunction={changePrice} id={id} 
                />
              } 
              title="Update listing price of this image"
              />
            <Button variant="outlined" onClick={unlist}>Unlist</Button>
            </>}
            </>}
          </CardActions>}
        </Card>
    )
}

export default GIRImageCard;