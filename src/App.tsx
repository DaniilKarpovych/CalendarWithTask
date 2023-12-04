import React, {useRef} from 'react';
import Header from "./components/Header";
import styled from "styled-components";
import {createGlobalStyle} from "styled-components"
import Calendar from "./components/Calendar";
import {toPng} from 'html-to-image';


const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  input {
    border-color: transparent; /* Set the border color to transparent or the desired color */
  }

  input:focus {
    outline: none; /* Remove the default outline */
    border-color: transparent; /* Set the border color to transparent or the desired color */
  }

  body {
    padding: 0;
    margin: -20px 0 0 0;
    overflow-x: hidden;
  }
`
const StyledApp = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
`

function App() {
    const elementRef = useRef<HTMLDivElement | null>(null);

    const htmlToImageConvert = () => {

        if (elementRef?.current) {
            toPng(elementRef?.current, {cacheBust: false})
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    link.download = "my-image-name.png";
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err) => {
                    console.log(err);
                });
        }


    };


    return (
        <StyledApp ref={elementRef}>
            <Header/>
            <Calendar downloadAsImage={htmlToImageConvert}/>
            <GlobalStyle/>
        </StyledApp>
    );
}

export default App;
