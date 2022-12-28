import { Navbar, Container } from 'react-bootstrap';
import NavWallet from './NavWallet';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useEthers } from '@usedapp/core';

const Index = () => {
  const { account } = useEthers();
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const onClick = useCallback(() => {
    location.href = '/';
  }, []);

  return (
    <>
      <NavBarCustom expand="xl" expanded={isNavExpanded}>
        <Container>
          <BrandAndTreasuryWrapper>
            <NavBarBrand>
              <NavBarLogo
                src="/logo.svg"
                alt="Nouns DAO logo"
                onClick={onClick}
              />
            </NavBarBrand>
          </BrandAndTreasuryWrapper>
          <NavBarToggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">
            <NavWallet address={account || '0'} />
          </Navbar.Collapse>
        </Container>
      </NavBarCustom>
    </>
  );
};

export default Index;

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
  cursor: pointer;

  :hover {
    transform: scale(0.95);
  }
`;
