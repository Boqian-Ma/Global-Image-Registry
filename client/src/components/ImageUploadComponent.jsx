import { useState } from "react";
import React from "react";
import { uploadToIPFS, hashImage } from "../utils/helpers";
import { createContract } from "../utils/blockchain";

/// Use infura gateway to avoid having to run local node,
/// Gateway is currently free however will eventually require auth and have data limits
const createClient = require("ipfs-http-client");
const ipfsClient = createClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function ImageUploadComponent() {
  const [currImage, setCurrImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  async function uploadImage() {
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
      const imageHash = hashImage(currImage);
      createContract(ipfsData.path, imageHash);
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
      <input
        type="file"
        onChange={(ev) => handleImageChange(ev)}
        accept={"image/*"}
      />
      <button onClick={uploadImage}>Upload</button>
      {uploadedImage && <p>{uploadImage}</p>}
      {uploadedImage && (
        <img src={`https://ipfs.io/ipfs/${uploadedImage.path}`} />
      )}
    </div>
  );
}

export default ImageUploadComponent;
