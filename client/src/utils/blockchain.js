/// Contains functions for creating a new contract instance 

export async function createContract(state, title, description, cid, hash) {
    console.log(state.contracts.ImageOwnership);
    const result = await state.contracts.ImageOwnership.createNewImage.call(title, hash, description, cid);
    console.log(result);
}