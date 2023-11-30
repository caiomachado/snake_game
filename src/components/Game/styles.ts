import styled from "styled-components"
import { MapSize } from "../../App"

export const Board = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }
`

export const Map = styled.div<{ mapSize: MapSize }>`
    display: flex;
    flex-wrap: wrap; 
    width: ${props => props.mapSize === "large" ? '320px' : props.mapSize === 'medium' ? '240px' : '160px'};
    height: ${props => props.mapSize === "large" ? '320px' : props.mapSize === 'medium' ? '240px' : '160px'};

    .block {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: 1px solid #4b4b9e;
        
        .food {
            border-radius: 50%;
            background-color: white;
            width: 50%;
            height: 50%;
        }            
    }
`

export const SnakeHead = styled.div<{ direction: string }>`
    border-radius: 100px 100px 50% 50%;
    background-color: #109710;
    width: 50%;
    height: 50%;
    position: relative;
    transform: rotate(${props => props.direction});

    .tongue {
        position: absolute;
        width: 2px;
        height: 4px;
        background-color: #bc1010;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .neck {
        position: relative;
        width: 9px;
        height: 6px;
        background-color: #109710;
        transform: translate(0, 135%);

        ::before {
            content: '';
            position: absolute;
            border-radius: 50%;
            width: 2px;
            height: 2px;
            background-color: #a6a636;
            top: 3px;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    ::before {
        content: '';
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: #bc1010;
        top: 2px;
        left: 0;
    }

    ::after {
        content: '';
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background-color: #bc1010;
        top: 2px;
        right: 0;
    }
`

export const SnakeBody = styled.div<{ direction: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9px;
    height: 100%;
    position: relative;
    background-color: #109710;
    margin: 0 auto;
    transform: rotate(${props => props.direction});
    z-index: 10;

    .dot {
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background-color: #a6a636;
        z-index: 10;
    }

    &.curved {
        ::before {
            content: '';
            position: absolute;
            width: 14px;
            height: 9px;
            margin-left: -5px;
            background-color: #109710;
            z-index: 1;
        }

        ::after {
            content: '';
            position: absolute;
            width: 14px;
            height: 5px;
            background-color: black;
            bottom: 0;
        }

        &.top-left {
            transform: rotate(0deg);
        }

        &.top-right {
            transform: rotate(90deg);
        }

        &.bottom-right {
            transform: rotate(180deg);
        }

        &.bottom-left {
            transform: rotate(270deg);
        }
    }
`