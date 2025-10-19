function getDefaultTransactionPayload(address, fromBlock, untilBlock, direction = 'out', pageKey = null) {
  // Convertir bloques a formato hexadecimal si no es 'latest'
  const formatBlock = (block) => {
    if (block === 'latest') return 'latest';
    const blockNum = parseInt(block, 10);
    return '0x' + blockNum.toString(16);
  };

  const payload = {
    fromBlock: formatBlock(fromBlock),
    toBlock: formatBlock(untilBlock),
    fromAddress: direction === 'out' ? address : "0x0000000000000000000000000000000000000000",
    toAddress: direction === 'in' ? address : "0x0000000000000000000000000000000000000000",
    excludeZeroValue: false,
    order: "desc",
    withMetadata: false,
    maxCount: "0x19", // 25 en hexadecimal
    category: []
  };
  
  // Solo añadir pageKey si existe
  if (pageKey) {
    payload.pageKey = pageKey;
  }
  
  return payload;
}
export { getDefaultTransactionPayload };