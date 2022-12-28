import React from 'react';
import Link from 'next/link';
import toShortAddress from '../../utils/toShortAddress';

type Props = {
  href: string;
  children: string;
};

export const TransactionLink = ({ href, children }: Props) => {
  return (
    <p
      style={{
        backgroundColor: '#FFFFFF',
        padding: 8,
        marginTop: 8,
        borderRadius: 8,
      }}
    >
      Transaction Hash:{' '}
      <Link href={href} target="_blank" style={{ cursor: 'pointer' }}>
        {toShortAddress(children)}
      </Link>
    </p>
  );
};

export default TransactionLink;
