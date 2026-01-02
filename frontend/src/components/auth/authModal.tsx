import { InputOTPWithSeparator } from "./InputOtpCard";

interface authModal {
    heading : string ;
    onclose : () => void;
}


export const AuthModal = ({heading , onclose} : authModal) => {
    return (
        <div className="modal-overlay absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#00000080]">
            {/* Wrap the whole Modal inside the newly created StyledModalWrapper
            and use the ref */}
            <div className="modal-wrapper w-[500px] h-[600px]">
                <div className="modal bg-white h-full w-full border-r-8 p-4">
                    <div className="modal-header">
                        <a href="#" onClick={onclose}>
                            x
                        </a>
                    </div>
                    {heading && <h1>{heading}</h1>}
                    <InputOTPWithSeparator />
                </div>
            </div>
        </div>
    )
};



