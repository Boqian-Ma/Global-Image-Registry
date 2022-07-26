/*
Contains functions for storing an image file on IPFS
*/
import sha256 from 'crypto-js/sha256';
import WordArray from 'crypto-js/lib-typedarrays'

export async function uploadToIPFS(image, ipfsInstance) {
    try {
        return await ipfsInstance.add(image)
    } catch (e) {
        throw e;
    }
}
export async function hashImage(file, callback) {
    const fReader = new FileReader();
    fReader.onloadend = (ev) => {
        if (ev.target.readyState !== fReader.DONE) return;
        const wordArray = WordArray.create(ev.target.result);
        const hash = sha256(wordArray).toString();
        console.log(hash)
        callback(hash)
    }
    fReader.readAsArrayBuffer(file);
}