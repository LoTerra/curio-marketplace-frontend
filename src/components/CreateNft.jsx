import React, { useState, useEffect } from 'react'
import { useStore } from '../store'
import toast, { Toaster } from 'react-hot-toast';
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
    Denom,
    CreateTxOptions,
    MsgSend
} from '@terra-money/terra.js'

export default function CreateNft(props) {

    const { state, dispatch } = useStore()

    let network = {}
    let connectedWallet = {}
  
  
    if (typeof document !== 'undefined') {
        network = useWallet().network;
        connectedWallet = useConnectedWallet()
    }

    async function create(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data)

      if (!connectedWallet) return
    
      if(connectedWallet){
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
      }

      try {
        let msg = new MsgExecuteContract(connectedWallet.walletAddress, state.privTokenContract,{
            send_nft: {
                contract: data.contract_address,
                token_id: data.token_id
            }
        }, {uusd: String(1 * 1000000)})

        const result = await connectedWallet.post({            
            msgs: [msg]
        })
        console.log(result)            
        toast.success('Nft creation succesful')  
    }catch (e) {
        console.log(e)       
        toast.error('Nft creation error')
    }

    }

    return (
        <div className="modal fade" id="createNftModal" tabIndex="-1" aria-labelledby="createNftModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNftModalLabel">Create NFT</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => create(e)}>
                  <div className="row">
                      <div className="col-12 mb-3">
                          <label>Nft contract address</label>
                          <input className="form-control" name="contract_address" required/>
                      </div>
                      <div className="col-12 mb-3">
                      <label>Token ID</label>
                          <input className="form-control" name="token_id" required/>
                      </div>                   
                      <div className="col-12 mt-3">
                        <button type="button" type="submit" className="btn btn-primary w-100">Create</button>
                      </div>
                  </div>
                </form>
            </div>      
          </div>
        </div>
      </div>
    )
}