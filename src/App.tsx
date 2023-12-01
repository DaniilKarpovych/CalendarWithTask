import React, {useState} from 'react';
import Header from "./components/Header";
import styled from "styled-components";
import {createGlobalStyle} from "styled-components"
import Calendar from "./components/Calendar";


const GlobalStyle = createGlobalStyle`

  body {
    margin-top: -20px;
    padding: 0;
  }
`
const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
`


function App() {
    return (
        <StyledApp>
            <Header/>
            <Calendar/>
            <GlobalStyle/>
        </StyledApp>
    );
}

export default App;
