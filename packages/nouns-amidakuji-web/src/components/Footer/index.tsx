import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

export const Footer = () => {
  return (
    <StyledFooter>
      <div>
        <Link
          href="https://komorebi88.notion.site/Nouns-Amidakuji-7e07778d1c3c41a0a757fecacb665230"
          target="_blank"
        >
          Docs is here
        </Link>
      </div>
      {`© ${new Date().getFullYear()} NounsDAO JAPAN`}
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  font-family: 'PT Root UI';
  text-align: center;
  font-weight: bold;
  margin-top: 64px;
  margin-bottom: 32px;
`;

export default Footer;
