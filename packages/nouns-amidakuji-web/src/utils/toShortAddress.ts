export const toShortAddress = (address: string) => {
  return address && [address.substr(0, 8), address.substr(34, 8)].join('...');
};

export default toShortAddress;