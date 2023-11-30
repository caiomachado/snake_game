import styled from 'styled-components'

export const Wrapper = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    height: 100%;

    .heading {
        font-size: 20px;
        color: white;
    }

    .subHeading {
        font-size: 18px;
        color: white;
        text-transform: capitalize;
    }

    .setting-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .play-block {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .button-block {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
    }
`