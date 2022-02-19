import React from 'react';
import styled from "styled-components";
export default function Letter() {
    return (
        <Input
            maxLength={1}
        />
  )
}

const Input = styled.input`
background-color:red;
width:50px;
height:50px;
margin-left: 5px;
margin-bottom: 5px;
`
