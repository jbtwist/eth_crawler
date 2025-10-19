function getDefaultTransactionPayload(address, fromBlock, untilBlock) {
  return {
    from_block: fromBlock,
    to_block: untilBlock,
    fromAddress: address,
    toAddress: "0x0000000000000000000000000000000000000000",
    excludeZeroValue: true,
    order: "desc",
    withMetadata: false,
    maxCount: "0x3e8",
    category: []
  };
}
export { getDefaultTransactionPayload };