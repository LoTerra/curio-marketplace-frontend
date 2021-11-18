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
import { X } from 'phosphor-react';
import StepZilla from "react-stepzilla";
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

export default function CreateAuction(props) {

    const { state, dispatch } = useStore()

    let network = {}
    let connectedWallet = {}

    const steps =
    [
      {name: 'Step 1', component: <Step1 />},
      {name: 'Step 2', component: <Step2 />},
      {name: 'Step 3', component: <Step3 />},
    ]
  
  
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
       let auction_msg = {
           create_auction_nft:{
               end_time: new Date(data.end_time).getTime() / 1000
           }
       };

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
        <>
        <form className="auctionForm" onSubmit={(e) => create(e)}>
            <div className='step-progress'>
            <StepZilla 
            steps={steps}
            showNavigation={true}
            nextButtonCls='btn btn-prev btn-primary float-end'
            backButtonCls='btn btn-next btn-secondary float-start'
            />
            </div>
        </form>  
                  
                     
                </>
    )
}