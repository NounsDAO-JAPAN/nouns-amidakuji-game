import React from 'react';
import styled from 'styled-components';

export const Footer = () => {
  return (
    <StyledFooter>{`© ${new Date().getFullYear()} NounsDAO JAPAN`}</StyledFooter>
  );
};

const StyledFooter = styled.footer`
  font-family: 'PT Root UI';
  text-align: center;
  font-weight: bold;
  margin-top: 64px;
`;

export default Footer;
