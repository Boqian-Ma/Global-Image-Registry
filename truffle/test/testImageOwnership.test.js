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
            await contract.createNewImage("title", "hash", "description", "cid");
            const numImages = await contract.getNumImages();
            assert.equal(numImages, 1, "Image was successfully added");
        })

        it("Cannot add duplicate image", async () => {
            try {
                await contract.createNewImage("New Title", "hash", "Different description", "Diff cid");
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
            await contract.createNewImage("img2", "hash2", "desc2", "ipfs2", { from: accountOne });
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
        
        it("Owner can transfer once approved approval", async () => {
            let accountCount = await contract.balanceOf(accountOne);
            assert.equal(accountCount, 2, "Owner still has two images before trying to transfer");
            await contract.transferFrom(accountOne, accountTwo, 0, { from: accountOne });
            accountCount = await contract.balanceOf(accountOne);
            assert.equal(accountCount, 1, "Owner now has one images");
            const acc2 = await contract.balanceOf(accountTwo);
            assert.equal(acc2, 1, "Acc2 now has one image");
        })
    })
})