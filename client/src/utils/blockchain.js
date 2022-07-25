/// Contains functions for creating a new contract instance 

export async function createContract(state, title, description, hash, cid) {
    try {

        console.log(state.contracts.ImageOwnership);
        await state.contracts.ImageOwnership.methods.createNewImage(title, description, hash, cid).send({ from: state.address });
        console.log(await state.contracts.ImageOwnership.methods.getNumImages().call())
    } catch (err) {
        console.log("Err", err);
    }
}