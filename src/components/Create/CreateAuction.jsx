import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
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
import { CheckSquareOffset, Heart, SlidersHorizontal, X } from 'phosphor-react';

export default function CreateAuction(props) {

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

      if (!connectedWallet) {
            toast.error('Connect your wallet')
           return false;
      }
    
      if(connectedWallet){
            console.log('walletAddress is', connectedWallet.walletAddress)
            // In this case network should be testnet bombay
            console.log('network is', connectedWallet.network)
            console.log('connectType is', connectedWallet.connectType)
      }

      try {
       let auction_msg = {
           create_auction_nft:{
               end_time: new Date(data.end_time).getTime() / 1000
           }
       };

      if (data.start_time) {
          auction_msg.create_auction_nft.start_time = new Date(data.start_time).getTime() / 1000
      }

    //   if (data.category) {
    //     auction_msg.create_auction_nft.category = String(data.category)
    //   }

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
        <>
        <form className="auctionForm" onSubmit={(e)=> create(e)}>

            <div className="row mb-4">
                <div className="col-md-3">
                    <span className="icon"><CheckSquareOffset size={70} weight="light" /><CheckSquareOffset size={70} weight="light" /></span>
                    <p className="info">Set your auction to your needs, decide when your auction starts and end.</p>
                </div>
                <div className="col-md-9">
                    <div className="col-12">
                        <h5>Main details</h5>
                    </div>
                    <div className="col-12 mb-3">
                        <label>Nft contract address</label>

                        <input type="text" className="form-control" name="contract_address" required />
                    </div>
                    <div className="col-12 mb-3">
                        <label>Token ID</label>
                        <input type="text" className="form-control" name="token_id" required />
                    </div>
                    {/* <div className="col-12 mb-3">
                        <label>NFT Category</label>                        
                        <select className="form-control" name="category" required>
                            <option value="">Select category</option>
                        { state.categories.map((obj,i) => {
                            return <option value={obj}>{obj}</option>
                        })}
                        </select>
                    </div> */}
                </div>


            </div>
            <div className="row mb-4">

                <div className="col-md-3">
                <span className="icon"><SlidersHorizontal size={70} weight="light" />       <SlidersHorizontal size={70} weight="light" /></span>             
                    <p className="info">Set your auction to your needs, decide when your auction starts and end.</p>
                </div>
                <div className="col-md-9">
                    <div className="row">
                        <div className="col-12">
                            <h5>Auction settings</h5>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Time end</label>
                            <input type="datetime-local" className="form-control" name="end_time" required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Time start</label> <small>optional</small>
                            <input type="datetime-local" className="form-control" name="start_time" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Start/Minimal price</label> <small>optional</small>
                            <input type="number" className="form-control" name="start_price" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Instant buy price</label> <small>optional</small>
                            <input type="number" className="form-control" name="instant_buy" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Reserve price</label> <small>optional</small>
                            <input type="number" className="form-control" name="reserve_price" />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Private sale amount</label> <small>optional</small>
                            <input type="number" className="form-control" name="private_sale_privilege" />
                        </div>
                    </div>
                </div>

            </div>
            <div className="row">
                <div className="col-md-3">
                <span className="icon"> <Heart size={70} weight="light" /><Heart size={70} weight="light" /></span>
                    <p className="info">Set your auction to your needs, decide when your auction starts and end.</p>
                </div>
                <div className="col-md-9">
                    <div className="row">
                        <div className="col-12">
                            <h5>Charity options</h5>
                        </div>
                        <div className="col-12 mb-3">
                            <label>Charity address</label> <small>optional</small>
                            <input type="text" className="form-control" name="charity_address" />
                        </div>
                        <div className="col-12 mb-3">
                            <label>Charity percentage fee</label> <small>optional</small>
                            <input type="number" className="form-control" name="charity_fee" />
                        </div>
                        <div className="col-12 mt-3 mb-3">
                            <button type="button" type="submit" className="btn btn-primary w-100">Create</button>
                        </div>
                    </div>
                </div>
            </div>



        </form>
                  
                     
                </>
    )
}