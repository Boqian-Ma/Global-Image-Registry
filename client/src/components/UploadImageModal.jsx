import BasicModal from "./BasicModal";

function UploadImageModal({buttonType, name, component}) {
    return (
        <BasicModal buttonType={buttonType} name={name} component={component}/>
    )
}

export default UploadImageModal;