// @flow

import type { EdgeSpendTarget, EdgeMetadata, EdgeSpendInfo, EdgeTransaction } from 'edge-core-js'

import { STANDARD_FEE } from '../../../../constants/indexConstants'
import type { State } from '../../../ReduxTypes'
import { getSceneState, getSelectedCurrencyCode } from '../../selectors.js'

export type GuiMakeSpendInfo = {
  currencyCode?: string,
  customNetworkFee?: any,
  metadata?: any,
  nativeAmount?: string,
  networkFeeOption?: string,
  publicAddress?: string,
  spendTargets?: Array<EdgeSpendTarget>,
  uniqueIdentifier?: string
}

export type SpendOptions = {
  lock: boolean,
  sign: boolean,
  broadcast: boolean,
  save: boolean
}

export type SendConfirmationState = {
  forceUpdateGuiCounter: number,
  destination: string,

  nativeAmount: string,

  parsedUri: GuiMakeSpendInfo,
  spendInfo: EdgeSpendInfo | null,
  spendOptions: SpendOptions | null,

  pin: string,

  transaction: EdgeTransaction | null,
  transactionStatus: 'pending' | 'error' | null,
  error: Error | null
}

export const initialState = {
  forceUpdateGuiCounter: 0,

  parsedUri: {
    networkFeeOption: (STANDARD_FEE: string),
    customNetworkFee: {},
    publicAddress: '',
    nativeAmount: '0',
    metadata: {
      payeeName: '',
      category: '',
      notes: '',
      amountFiat: 0,
      bizId: 0,
      miscJson: ''
    }
  },

  pin: '',

  spendInfo: null,
  destination: '',
  nativeAmount: '0',

  isEditable: true,

  transaction: {
    txid: '',
    date: 0,
    currencyCode: '',
    blockHeight: -1,
    nativeAmount: '0',
    networkFee: '',
    parentNetworkFee: '',
    ourReceiveAddresses: [],
    signedTx: '',
    metadata: {},
    otherParams: {}
  },
  pending: false,
  error: null
}

export const getScene = (state: State): any => getSceneState(state, 'sendConfirmation')
export const getPending = (state: State): boolean => getScene(state).pending
export const getError = (state: State): Error => getScene(state).error

export const getTransaction = (state: State): EdgeTransaction => getScene(state).transaction || initialState.transaction
export const getParsedUri = (state: State): GuiMakeSpendInfo => getScene(state).parsedUri || initialState.parsedUri
export const getForceUpdateGuiCounter = (state: State): number => getScene(state).forceUpdateGuiCounter

export const getNetworkFeeOption = (state: State): string => getParsedUri(state).networkFeeOption || initialState.parsedUri.networkFeeOption || ''
export const getCustomNetworkFee = (state: State): any => getParsedUri(state).customNetworkFee || initialState.parsedUri.customNetworkFee || {}
export const getMetadata = (state: State): EdgeMetadata => getParsedUri(state).metadata || initialState.parsedUri.metadata || {}
export const getPublicAddress = (state: State): string => getParsedUri(state).publicAddress || initialState.parsedUri.publicAddress || ''
export const getNativeAmount = (state: State): string | void => state.ui.scenes.sendConfirmation.nativeAmount

export const getUniqueIdentifier = (state: State): string => {
  const parsedUri = getParsedUri(state)
  const uniqueIdentifier = parsedUri.uniqueIdentifier
  return uniqueIdentifier || ''
}

export const getNetworkFee = (state: State): string => getTransaction(state).networkFee
export const getParentNetworkFee = (state: State): string | void => getTransaction(state).parentNetworkFee

export const getSpendInfo = (state: State, newSpendInfo?: GuiMakeSpendInfo = {}): EdgeSpendInfo => {
  const uniqueIdentifier = newSpendInfo.uniqueIdentifier || getUniqueIdentifier(state)

  return {
    currencyCode: newSpendInfo.currencyCode || getSelectedCurrencyCode(state),
    metadata: newSpendInfo.metadata ? { ...getMetadata(state), ...newSpendInfo.metadata } : getMetadata(state),
    spendTargets: [
      {
        nativeAmount: newSpendInfo.nativeAmount || getNativeAmount(state),
        publicAddress: newSpendInfo.publicAddress || getPublicAddress(state),
        otherParams: {
          uniqueIdentifier
        }
      }
    ],
    networkFeeOption: newSpendInfo.networkFeeOption || getNetworkFeeOption(state),
    customNetworkFee: newSpendInfo.customNetworkFee ? { ...getCustomNetworkFee(state), ...newSpendInfo.customNetworkFee } : getCustomNetworkFee(state)
  }
}
