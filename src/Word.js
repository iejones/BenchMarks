import React from 'react';
import styled from "styled-components";
import Letter from "./Letter"

import RICIBs from 'react-individual-character-input-boxes';

export default function Word( input) {

    function handleOutputString(string) {
        return string;
        //this.setState({ outputString: string })
    }

    return (
        <div>
            <RICIBs
                amount={5}
                handleOutputString={handleOutputString}
                inputProps= {input}      
                inputRegExp={/^[a-z]$/}
            />
        </div>
    )
}

const fsad = styled.input`
background-color:red;
width:50px;
height:50px;
margin-left: 5px;
margin-bottom: 5px;
`
