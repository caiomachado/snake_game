import styled from "styled-components";

export const Container = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border-radius: 4px;
    background: transparent;
    color: white;
    cursor: pointer;
    border: none;
    outline: none;
    font-weight: bold;
    box-shadow: 0 0 2px 2px rgba(255, 255, 255, 0.6);
    transition: all 0.2s ease-in-out;

    &:hover, &.active {
        color: black;
        background: white;
    }

    &.modal-btn {
        color: black;
        box-shadow: 0 0 2px 2px black;
    }

    &.modal-btn:hover {
        color: white;
        background: black;
    }

    &.arrow-btn {
        width: 50px;
        height: 40px;
        padding: 0;

        &.active {
            transform: translateY(2px);
        }
    }
`