import styled from "styled-components";
import { allLetterBackgroundColors } from '../Constants/colors.js';

export const Letter = styled.input`
    font-size:56px;
    background-color: ${(props) => {
    return allLetterBackgroundColors[props.bgcolor];
    }};
    margin-right: 2px;
    margin-bottom: 6px;
    margin-top: 2px;
    padding: 5px;
    border-color: #53565A;
    width: 60px;
    height: 60px;
    text-align: center;
    border-radius: 8px;
`;

export const Div = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;

export const RowWrapper = styled.div`
    display: flex;
    gap: 8px;
`;

export const SubmitButton = styled.button`
    font-size: 30px;
    border-radius: 8px;
    background-color: #981E32;
    border-color: #981E32;
    padding: 14px;
    margin: 20px;
`;

export const Title = styled.h1`
    font-size: 52px;
`
