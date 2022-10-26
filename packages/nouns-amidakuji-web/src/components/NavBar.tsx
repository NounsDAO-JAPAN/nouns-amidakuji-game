import { Navbar, Container } from 'react-bootstrap';
import NavWallet from './NavWallet';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useEthers } from '@usedapp/core';

const NavBar = () => {
  const { account } = useEthers();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <>
      <NavBarCustom expand="xl" expanded={isNavExpanded}>
        <Container style={{ maxWidth: 'unset' }}>
          {/*<BrandAndTreasuryWrapper>*/}
          {/*  <NavBarBrand to="/">*/}
          {/*    <NavBarLogo src={'/logo.svg'} alt="Nouns DAO logo" />*/}
          {/*  </NavBarBrand>*/}
          {/*</BrandAndTreasuryWrapper>*/}
          <NavBarToggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">
            <NavWallet address={account || '0'} buttonStyle={4} />
          </Navbar.Collapse>
        </Container>
      </NavBarCustom>
    </>
  );
};

export default NavBar;

const NavBarCustom = styled(Navbar)`
  background-color: rgb(213, 215, 225);
  padding-bottom: 1rem;
`;

const NavBarToggle = styled(Navbar.Toggle)`
  border-radius: 10px;
  height: 44px;
  padding: 0.25rem 0.5rem;
  margin-right: 12px;
`;

const NavBarLogo = styled.img`
  width: 75px;
  height: 75px;
`;

const BrandAndTreasuryWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
`;

const NavBarBrand = styled(Navbar.Brand)`
  position: relative;
  z-index: 2;
  padding: 1rem 0rem;
  transition: all 0.15s ease-in-out;

  :hover {
    transform: scale(0.95);
  }
`;
