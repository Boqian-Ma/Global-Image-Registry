const ImageOwnership = artifacts.require("ImageOwnership");

contract("ImageOwnership", (accounts) => {
    let contract;
    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    before(async () => {
        contract = await ImageOwnership.deployed();
    });
    
    describe("User can add an image to the contract", async () => {
        before("There are no images added", async () => {
            const numImages = await contract.getNumImages();
            assert.equal(numImages, 0, "There are no images existing");
        })
        
        it("Can add an image", async () => {
            await contract.createNewImage("title", "description", "hash", "cid");
            const numImages = await contract.getNumImages();
            assert.equal(numImages, 1, "Image was successfully added");
        })

        it("Cannot add duplicate image", async () => {
            try {
                await contract.createNewImage("New Title", "Different description", "hash", "Diff cid");
            } catch (err) {
                assert(err); 
            }
            const numImages = await contract.getNumImages();
            assert.equal(numImages, 1, "Image was not added");
        })
        
        it("Tracks how many images an account has", async () => {
            const ownerCount =  await contract.balanceOf(accountOne);
            assert.equal(ownerCount, 1, "Owner has one image")
            const owner2Count = await contract.balanceOf(accountTwo);
            assert.equal(owner2Count, 0, "Owner has no images");
        })
    })
    
    describe("Users can approve and transfer ownership of images", async () => {
        before("Establish scenario", async() => {
            await contract.createNewImage("img2", "desc2", "hash2", "ipfs2", { from: accountOne });
        })
        
        it("Does not allow owner to transfer before approval", async () => {
            const bal1 = await contract.balanceOf(accountOne);
            try {
                await contract.transferFrom(accountOne, accountTwo, 0, { from: accountOne });
            } catch (err) {
                assert(err);
            }
            assert(bal1, await contract.balanceOf(accountOne), "No change in image count for account one");
        })
        
        
        it("Does not allow non image owner to approve image", async () => {
            try {
                await contract.approve(accountOne, 1, { from: accountTwo} );
            } catch (e) {
                assert(e, "Function fails");
            }
        })

        it("Does not allow non owner to transfer, non approved image", async () => {
            //AcountTwo is owner of image 0
            try {
                await contract.transferFrom(accountTwo, AccountOne, 0, { from: accountOne})
                assert(true, false, "Function failed to fail");
            } catch (e) {
                assert(e);
            }
        })

        it("The owner can approve the image", async () => {
            try {
                await contract.approve(accountOne, 0, { from: accountOne });
            } catch (err) {
                assert(1, 0, err);
            }
        })
        
        it("Owner can transfer once approved", async () => {
            let accountCount = await contract.balanceOf(accountOne);
            assert.equal(accountCount, 2, "Owner still has two images before trying to transfer");
            await contract.transferFrom(accountOne, accountTwo, 0, { from: accountOne });
            accountCount = await contract.balanceOf(accountOne);
            assert.equal(accountCount, 1, "Owner now has one images");
            const acc2 = await contract.balanceOf(accountTwo);
            assert.equal(acc2, 1, "Acc2 now has one image");
        })
    })
    describe("Users can list, change prices and unlist images", async () => {
        before("Add images to be sold", async () => {
            await contract.createNewImage("img2", "desc3", "hash3", "ipfs3", { from: accountOne });
            await contract.createNewImage("img3", "desc4", "hash4", "ipfs4", { from: accountOne });
        4})
        
        it("Cannot list unapproved image", async () => {
            try {
                await contract.listImage(2, 1, { from: accountOne })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e);
            }
        })
        it("Cannot change price unlisted image", async () => {
            try {
                await contract.changeListingPrice(2, 1, { from: accountOne })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e);
            }
        }) 
        it("Cannot unlist unlisted image", async () => {
             try {
                await contract.unlistImage(2, { from: accountOne })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e);
            } 
        })

        it("Cannot allow non-owner to list approved image", async () => {
            await contract.approve(accountOne, 2, { from: accountOne });
            try {
                await contract.listImage(2, 1, { from: accountTwo })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e)
            }
        })
        it("Owner can list approved image", async () => {
            await contract.listImage(2, 15, { from: accountOne })
            const img2 = await contract.getImageDetails(2);
            assert(img2.forSale == true);
            assert(img2.price == 15);
        })
        
        it("Cannot allow non-owner to change price", async () => {
            try {
                await contract.changeListingPrice(2, 5, { from: accountTwo })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e)
            }
        })
        it("Cannot allow non-owner to unlist image", async () => {
            try {
                await contract.unlistImage(2, { from: accountTwo })
                assert(true, false, "Function failed to throw error");
            } catch (e) {
                assert(e)
            }
        })
        it("Owner can change price", async () => {
            await contract.changeListingPrice(2, 50, { from: accountOne })
            const img2 = await contract.getImageDetails(2);
            assert(img2.price == 50);
        })
        it("Owner can unlist image", async () => {
            await contract.unlistImage(2, {from: accountOne})
            const img2 = await contract.getImageDetails(2);
            assert(img2.forSale == false);
        })
    })
    
    describe("Users can sell images", async () => {
        // for all scenarios account 1 is the seller, account 2 is the buyer
        before("List image", async () => {
            await contract.listImage(2, 50, { from: accountOne})
        })
        
        it("Buyer cannot purchase unlisted image", async () => {
            try {
                await contract.buyImage(3, { from: accountTwo, value: 51})
                assert(true, false, "Function failed to fail")
            } catch (err) {
                assert(err);
            }
        })
        
        it("Buyer cannot purchase image for less than asking price", async () => {
            try {
                await contract.buyImage(2, { from: accountTwo, value: 5})
                assert(true, false, "Function failed to fail")
            } catch (err) {
                assert(err);
            }
        })
        
        it("Buyers can purchase images", async () => {
            const c1 = await contract.balanceOf(accountOne);
            const c2 = await contract.balanceOf(accountTwo);
            const bal1 = await web3.eth.getBalance(accountOne);
            const bal2 = await web3.eth.getBalance(accountTwo);
            await contract.buyImage(2, { from: accountTwo, value: 50 })
            // check ownership is transfered, 
            // no longer for sale
            const img = await contract.getImageDetails(2);
            assert(img.forSale == false, "Image is still for sale"); 
            assert(await contract.getImageOwner(2) == accountTwo, "Ownership has not changed"); 
            assert(c1, await contract.balanceOf(accountOne)-1, "Balance not updated for seller")
            assert(c2, await contract.balanceOf(accountTwo)+1, "Balance not updated for buyer")
            // balance decreased/increased
            assert(bal1, await web3.eth.getBalance(accountOne) +  50, "Seller was not compensated")
            assert(bal2, await web3.eth.getBalance(accountTwo) -  50, "Buyer did not spend eth")
        })
    })
})