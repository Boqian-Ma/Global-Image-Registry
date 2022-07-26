import { useState } from "react";
import React from "react";
import { uploadToIPFS, hashImage } from "../utils/helpers";

/// Use infura gateway to avoid having to run local node,
/// Gateway is currently free however will eventually require auth and have data limits
const createClient = require("ipfs-http-client");
const ipfsClient = createClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function ImageUploadComponent({state, setState}) {
  const [currImage, setCurrImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [currTitle, setCurrTitle] = useState('');
  const [currDescription, setCurrDescription] = useState('');

  async function uploadImage(ev) {
    ev.preventDefault();
    if (!currImage || !currTitle || !currDescription) return;
    console.log(`Title: ${currTitle}, Desc: ${currDescription}, img: ${currImage}`);
    try {
      const ipfsData = await uploadToIPFS(currImage, ipfsClient);
      console.log(ipfsData);
      // const dummyObj =
      //     {
      //         "path": "QmaQQzwF625qUT9Ts4jc5DnRDmL9bLpNophjmHhVwhYWYF",
      //         "size": 87785
      //     }
      /* ipfsData is an object containing:
            {
                cid: CID,
                path: string representing the hashed value of the input, URL where file is stored
                size: number of bytes in the stored file
            }
            */
      setUploadedImage(ipfsData);
      const uploadImage = async (hash) => {
        await state.contracts.ImageOwnership.methods.createNewImage(currTitle, currDescription, hash, ipfsData.path).send({ from: state.address });

      }
      await hashImage(currImage, uploadImage);
    } catch (e) {
      console.log("Failed to add image to IPFS with error: ", e);
      return;
    }
  }

  function handleImageChange(changeEvent) {
    setCurrImage(changeEvent.target.files[0]);
  }

  return (
    <div>
      <p>Please select an image</p>
      <form>
      <div>
      <label> Title:
        <input type="text" name="Title" onChange={(ev) => setCurrTitle(ev.target.value)} required/>
      </label>
      </div>
      <div>
      <label> Description:
        <input type="text" name="description" onChange={(ev) => setCurrDescription(ev.target.value)} required/>
      </label>
      </div>
      <input
        type="file"
        onChange={(ev) => handleImageChange(ev)}
        accept={"image/*"}
        required
        />
      <button type="submit" onClick={(ev) => uploadImage(ev)}>Upload</button>
      </form>
      {uploadedImage && <p>{uploadImage}</p>}
      {uploadedImage && (
        <img src={`https://ipfs.io/ipfs/${uploadedImage.path}`} />
      )}
      {/*Provide blockchain explorer link */}
    </div>
  );
}

export default ImageUploadComponent;
