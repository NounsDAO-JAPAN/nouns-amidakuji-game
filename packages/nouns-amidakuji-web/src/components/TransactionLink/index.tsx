import React from 'react';
import Link from 'next/link';
import toShortAddress from '../../utils/toShortAddress';

type Props = {
  href: string;
  children: string;
}

export const TransactionLink = ({
  href,
  children
}: Props) => {
  return (
    <p>
      Transaction Hash:{' '}
      <Link href={href}>
        <a target="_blank">{toShortAddress(children)}</a>
      </Link>
    </p>
  );
};

export default TransactionLink;