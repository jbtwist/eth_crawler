function getDefaultTransactionPayload(address, fromBlock, untilBlock, direction = 'out') {
  // Convertir bloques a formato hexadecimal si no es 'latest'
  const formatBlock = (block) => {
    if (block === 'latest') return 'latest';
    const blockNum = parseInt(block, 10);
    return '0x' + blockNum.toString(16);
  };

  return {
    fromBlock: formatBlock(fromBlock),
    toBlock: formatBlock(untilBlock),
    fromAddress: direction === 'out' ? address : "0x0000000000000000000000000000000000000000",
    toAddress: direction === 'in' ? address : "0x0000000000000000000000000000000000000000",
    excludeZeroValue: false,
    order: "desc",
    withMetadata: false,
    maxCount: "0x3e8",
    category: []
  };
}
export { getDefaultTransactionPayload };