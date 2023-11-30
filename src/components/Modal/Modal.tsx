import { Dialog, DialogOverlay } from "./styles"
import { Button } from "../Button/Button"

interface ModalProps {
    text: string
    buttonText: string
    isOpen: boolean
    handleCloseModal: () => void
}

export const Modal = ({ text, buttonText, isOpen, handleCloseModal }: ModalProps) => {
    if (!isOpen) return null

    return (
        <DialogOverlay>
            <Dialog open={isOpen}>
                <p>{text}</p>
                <Button
                    className="modal-btn"
                    handleClick={handleCloseModal} 
                    type="button"
                    text={buttonText}
                />
            </Dialog>
        </DialogOverlay>
    )
}