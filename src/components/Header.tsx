import React, {FC} from 'react';
import styled from "styled-components";

interface Props {
}
const StyledHeader = styled.div`
  height: 50px;
  background-color:orange;
  width: 100%;
`
const Header:FC<Props> = (props) => {
    return (
        <StyledHeader>
            <h2>Trial Calendar</h2>
        </StyledHeader>
    );
}

export default Header;
