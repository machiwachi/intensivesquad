import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IDOToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const idoTokenAbi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

export const idoTokenAddress =
  '0x0000000000000000000000000000000000000000' as const

export const idoTokenConfig = {
  address: idoTokenAddress,
  abi: idoTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WEDOToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wedoTokenAbi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

export const wedoTokenAddress =
  '0x0000000000000000000000000000000000000000' as const

export const wedoTokenConfig = {
  address: wedoTokenAddress,
  abi: wedoTokenAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__
 */
export const useReadIdoToken = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadIdoTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIdoTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadIdoTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadIdoTokenName = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadIdoTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIdoTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link idoTokenAbi}__
 */
export const useWriteIdoToken = /*#__PURE__*/ createUseWriteContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteIdoTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIdoTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIdoTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link idoTokenAbi}__
 */
export const useSimulateIdoToken = /*#__PURE__*/ createUseSimulateContract({
  abi: idoTokenAbi,
  address: idoTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIdoTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIdoTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link idoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIdoTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link idoTokenAbi}__
 */
export const useWatchIdoTokenEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: idoTokenAbi,
  address: idoTokenAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link idoTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIdoTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link idoTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIdoTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: idoTokenAbi,
    address: idoTokenAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__
 */
export const useReadWedoToken = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadWedoTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadWedoTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadWedoTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadWedoTokenName = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadWedoTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadWedoTokenTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wedoTokenAbi}__
 */
export const useWriteWedoToken = /*#__PURE__*/ createUseWriteContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteWedoTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteWedoTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteWedoTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wedoTokenAbi}__
 */
export const useSimulateWedoToken = /*#__PURE__*/ createUseSimulateContract({
  abi: wedoTokenAbi,
  address: wedoTokenAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateWedoTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateWedoTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wedoTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateWedoTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link wedoTokenAbi}__
 */
export const useWatchWedoTokenEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: wedoTokenAbi, address: wedoTokenAddress },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link wedoTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchWedoTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link wedoTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchWedoTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: wedoTokenAbi,
    address: wedoTokenAddress,
    eventName: 'Transfer',
  })
