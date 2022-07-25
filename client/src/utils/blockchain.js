/// Contains functions for creating a new contract instance 

export async function createContract(state, title, description, cid, hash) {
    try {

        console.log(state.contracts.ImageOwnership);
        await state.contracts.ImageOwnership.createNewImage.call(title, hash, description, cid);
    } catch (err) {
        console.log("Err", err);
    }
}