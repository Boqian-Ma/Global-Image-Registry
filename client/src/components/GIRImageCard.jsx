import Button from "@mui/material/Button";
// import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { FormControlLabel, RadioGroup, Typography, Radio, FormLabel } from "@mui/material";
import React, {useState, useEffect } from 'react';
import BasicModal from "./BasicModal";


function OneInputForm({label, type, submitText, submitFunction, id}) {
  const [input, setInput] = useState(null);
  return (
    <>
      <label> {label}
        <input type={type} onChange={ev => setInput(ev.target.value)}/>
      </label>
      <Button variant="contained" onClick={() => submitFunction(id, input)} sx={{marginTop: '10px'}}>{submitText}</Button>
    </>
  )
}

function LicenceForm({submitFunction, id}) {
  // TBC
  const call = (ev) => {
    ev.preventDefault()
    if (price === null || type === null) {
      return;
    }
    submitFunction(id, price, type);
  }
  const [price, setPrice] = useState(null)
  const [type, setType] = useState(null)
  return (
    <div>
      <div>
        <label> Price
          <input type="number" onChange={ev => setPrice(ev.target.value)}/>
        </label>
      </div>
      <FormLabel>Licence Type</FormLabel>
      <RadioGroup onChange={(ev) => setType(ev.target.value)}>
        <FormControlLabel value="0" control={<Radio size="small" />} label="RF"/>
        <FormControlLabel value="1" control={<Radio size="small" />} label="RR"/>
        <FormControlLabel value="2" control={<Radio size="small" />} label="RM"/>
      </RadioGroup>
     <Button variant="contained" onClick={ev => call(ev)}>Submit</Button> 
    </div>
  )
}

function GIRImageCard({id, state, setState}) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [ipfsAddr, setIpfsAddr] = useState(null);
    const [owner, setOwner] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isListed, setIsListed] = useState(false);
    const [price, setPrice] = useState(0);
    const [forLicence, setForLicence] = useState(false);
    const [licencePrice, setLicencePrice] = useState(0);
    const [numLicences, setNumLicences] = useState(0);
    const [licenceType, setLicenceType] = useState(0);
    
    const forceRefresh = () => {
      setState(prev => ({
        ...prev,
        modified: prev.modified++
      }))
    }
    const getLicenceType = (number) => {
      if (number == 0) return "RF";
      if (number == 1) return "RR";
      if (number == 2) return "RM"
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function initCard() {
        if (!state.address) return 
        try {
          const cardDetails = await state.contracts.ImageOwnership.methods.getImageDetails(id).call({ from: state.address });
          //console.log(cardDetails)
          setTitle(cardDetails.title);
          setDesc(cardDetails.description)
          setPrice(cardDetails.price)
          const owner = await state.contracts.ImageOwnership.methods.getImageOwner(id).call({ from: state.address})
          setOwner(owner.toLowerCase());
          setIpfsAddr(cardDetails.ipfs);
          setIsApproved(await state.contracts.ImageOwnership.methods.isTokenApproved(id).call( {from: state.address }))
          setIsListed(await state.contracts.ImageOwnership.methods.isImageListed(id).call( {from: state.address }))
          setForLicence(await state.contracts.ImageOwnership.methods.isImageListedForLicence(id).call({ from: state.address }))
          setLicencePrice(cardDetails.priceLicence)
          setNumLicences(cardDetails.numLicences)
          setLicenceType(getLicenceType(cardDetails.licenceType))
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
     
    async function licenceImage() {
      console.log("licence")
      await state.contracts.ImageOwnership.methods.buyLicence(id).send({ from: state.address, value: licencePrice })
      await initCard();
      forceRefresh()
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
      forceRefresh()
    }
    async function sell(id, input) {
      console.log("sell")
      await state.contracts.ImageOwnership.methods.listImage(id, input).send({ from: state.address })
      await initCard();
    }
    
    async function sellLicence(id, price, type) {
      console.log("Listing for licence")
      await state.contracts.ImageOwnership.methods.listImageLicence(id, price, type).send({ from: state.address })
      await initCard();
    }
    
    async function unlistLicence() {
      console.log("Unlist licence")
      await state.contracts.ImageOwnership.methods.unlistImageLicence(id).send({ from: state.address })
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
          {ipfsAddr != null && ipfsAddr !== "N/A" && <CardMedia
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
            <Typography>Licence Price: {licencePrice}</Typography>
            <Typography>{forLicence ? `Licence Type: ${licenceType}` : "Not listed for licencing"}</Typography>
            <Typography>Num licences: {numLicences}</Typography>
            
          </CardContent>
          {/*Functions if image does not belong to user */}
          {state.address !== owner && <CardActions>
            {isListed && <Button variant="contained" size="small" onClick={purchaseImage}>Purchase</Button>}
            {forLicence && <Button variant="outlined" size="small" onClick={licenceImage}>Licence</Button>}
          </CardActions>}
          {/*Functions if image does belong to user */}
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
            <Button variant="outlined" onClick={unlist} size="small">Unlist</Button>
            </>}
            </>}
            {isApproved && 
            <>
            {forLicence ? 
              <Button variant="outlined" size="small" onClick={unlistLicence}>Unlist licencing</Button>
              :
              <BasicModal 
                buttonType="outlined"
                name="List licence"
                title="Choose Licence price"
                Component={
                  <LicenceForm 
                    submitFunction={sellLicence} id={id} 
                  />
                }
              />
            }
            </>}
          </CardActions>}
        </Card>
    )
}

export default GIRImageCard;