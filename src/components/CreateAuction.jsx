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

export default function CreateAuction(props) {

    const { state, dispatch } = useStore()

    let network = {}
    let connectedWallet = {}
  
  
    if (typeof document !== 'undefined') {
        network = useWallet().network;
        connectedWallet = useConnectedWallet()
        console.log("connectedWallet", connectedWallet)
    }

    async function create(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data)

      // if (!connectedWallet) return
    
      if(connectedWallet){
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
      }

      try {
       let auction_msg = {
           create_auction_nft:{
               end_time: new Date(data.end_time).getTime() / 1000,
           }
       };
       console.log("result", auction_msg)
      if (data.start_time) {
          auction_msg.create_auction_nft.start_time = new Date(data.start_time).getTime() / 1000
      }

      if (data.charity_address &&  data.charity_fee){
          auction_msg.create_auction_nft.charity = { address: data.charity_address , fee_percentage: parseFloat(data.charity_fee)}
      }
      if (data.start_price){
          auction_msg.create_auction_nft.start_price = String(data.start_price * 1000000)
      }
      if (data.instant_buy){
          auction_msg.create_auction_nft.instant_buy = String(data.instant_buy * 1000000)
      }
      if (data.reserve_price){
          auction_msg.create_auction_nft.reserve_price = String(data.reserve_price * 1000000)
      }
      if (data.private_sale_privilege){
          auction_msg.create_auction_nft.private_sale_privilege = String(data.private_sale_privilege * 1000000)
      }

        let msg = new MsgExecuteContract(connectedWallet.walletAddress, String(data.contract_address),{
            send_nft: {
                contract: state.privTokenContract,
                token_id: data.token_id,
                msg:Buffer.from(JSON.stringify(auction_msg)).toString(
                    'base64'
                )
            }
        })

        const result = await connectedWallet.post({            
            msgs: [msg]
        })
        console.log(result)            
        toast.success('Auction successfully created')
    }catch (e) {
          console.log(e.message)
          console.log(e)
        toast.error('Auction creation error')
    }

    }

    return (
        <div className="modal fade" id="createNftModal" tabIndex="-1" aria-labelledby="createNftModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createNftModalLabel">Create NFT auction</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => create(e)}>
                  <div className="row">
                      <div className="col-12 mb-3">
                          <label>Nft contract address</label>
                          <input type="text" className="form-control" name="contract_address" required/>
                      </div>
                      <div className="col-12 mb-3">
                      <label>Token ID</label>
                          <input type="text" className="form-control" name="token_id" required/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Time end</label>
                          <input type="datetime-local" className="form-control" name="end_time" required/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Time start</label> <small>optional</small>
                          <input type="datetime-local" className="form-control" name="start_time"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Start/Minimal price</label> <small>optional</small>
                          <input type="number" className="form-control" name="start_price"/>
                      </div>   
                      <div className="col-12 mb-3">
                          <label>Instant buy price</label> <small>optional</small>
                          <input type="number" className="form-control" name="instant_buy"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Reserve price</label> <small>optional</small>
                          <input type="number" className="form-control" name="reserve_price"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Private sale amount</label> <small>optional</small>
                          <input type="number" className="form-control" name="private_sale_privilege"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Charity address</label> <small>optional</small>
                          <input type="text" className="form-control" name="charity_address"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Charity percentage fee</label> <small>optional</small>
                          <input type="number" className="form-control" name="charity_fee"/>
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