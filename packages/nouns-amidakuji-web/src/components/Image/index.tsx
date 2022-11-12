import React from 'react';
import styled from 'styled-components';

type Props = {
  src: string;
  alt: string;
};

const Image = ({ src, alt = '' }: Props) => {
  return <Img src={src} alt={alt} />;
};

const Img = styled.img`
  max-width: 100%;
  height: auto;
`;

export default Image;
