import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../../store'
import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
    Denom,
    CreateTxOptions,
    MsgSend, Coin,
} from '@terra-money/terra.js'

export default function WithdrawNft(props) {
    const { state, dispatch } = useStore()
    const { connectedWallet, auctionId, data } = props

    async function withdrawNFt() {
        if (!connectedWallet) {
            toast.error('connect wallet')
            return
        }
        try {
            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.privAuctionContract,
                {
                    withdraw_nft: { auction_id: auctionId },
                },
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: 'uusd',
                gasPrices: new Coin("uusd", "0.15")
            })
          //  console.log(result)
            toast.success('Withdraw NFT successful')
            //Not needed, we reload on websocket event
            //setTimeout(() => reloadData(),3000)
        } catch (e) {
           // console.log(e)
            toast.error('Withdraw NFT error')
        }
    }
    //console.log("data-props")
    ///console.log(data)
    return (
        <>
            <button
                className="btn btn-primary btn-lg w-100"
                type="button"
                disabled={data.resolved !== true ? false : true}
                onClick={() => withdrawNFt()}
            >
                {data.resolved !== true
                    ? 'Withdraw NFT'
                    : 'NFT Withdrawn succesful'}
            </button>
        </>
    )
}
