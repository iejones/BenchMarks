import styled from "styled-components";
import { allColors } from '../Constants/colors.js';

const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
};

export const device = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopL: `(min-width: ${size.desktop})`
};

export const Letter = styled.input`
    font-size:56px;
    background-color: ${(props) => {
    return allColors[props.bgcolor];
    }};
    margin-right: 1px;
    margin-left: 1px;
    margin-bottom: 3px;
    margin-top: 3px;
    padding: 5px;
    width: 100%; 
    
    text-align: center;
    border-radius: 8px;
    border-width: 5px;
    border-style: solid;
    &:focus {
        outline: none;
    };
    border-color: ${(props) => {
        return allColors[props.borderColor];
        }};
`;

export const Div = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    @media ${device.tablet} { 
        max-width: 400px;
      }
    @media ${device.laptop} { 
        max-width: 450px;
      }
    
      @media ${device.desktop} {
        max-width: 600px;
      }
`;

export const RowWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin-left: 2px;
    margin-right: 2px;
    margin-top:1px;
    margin-bottom:1px;
`;

export const SubmitButton = styled.button`
    font-size: 28px;
    border-radius: 8px;
    background-color: ${() => {
        return allColors["medium_grey"];
        }};
    border-color:  ${() => {
        return allColors["medium_grey"];
        }};
`;

export const Title = styled.h2`
    font-size: 52px;
`
