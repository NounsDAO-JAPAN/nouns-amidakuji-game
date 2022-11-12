import { Button } from 'react-bootstrap';
import styled from 'styled-components';

export const BidButton = styled(Button)`
  align-self: center;
  width: auto;
  height: 3rem;
  margin-top: 0.5em;
  margin-left: 0;
  padding: 10px 16px;
  border-radius: 12px;
  font-family: 'PT Root UI';
  color: white;
  border: transparent;
  background-color: var(--brand-black);
  font-weight: bold;
  letter-spacing: normal;
  font-size: 19px;
  transition: all 0.2s ease-in-out;

  @media (min-width: 992px) {
    margin-top: 0;
    margin-left: 0.6rem;
  }

  :disabled {
    outline: none;
    box-shadow: none;
    cursor: not-allowed;
    background-color: gray;
  }
`;

export default BidButton;