import { ButtonHTMLAttributes, ReactNode } from "react"
import { Container } from "./styles"

type ButtonProps = {
    text: string | ReactNode;
    handleClick: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ text, handleClick, ...rest }: ButtonProps) => {
    return <Container onClick={handleClick} {...rest}>{text}</Container>
}