import React, { useState} from 'react'
import CreateAuction from '../components/Create/CreateAuction'
import MintNft from '../components/Create/MintNft'
import {Coin, MsgExecuteContract} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";
import {useStore} from "../store";
import { FadersHorizontal } from 'phosphor-react';

export default () => {
    const { state, dispatch } = useStore()
    // Default 0
    const [fee, setFee] = useState(0)
    const [recipient, setRecipient] = useState("")
    const [updateInfo, setUpdateInfo] = useState("")

    let wallet = ''
    let connectedWallet = ''

    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }

    async function update_royalty(){
        try {
            let exec_msg = {
                update_royalty: {
                    fee: String(parseFloat(fee) / 100), // max 100 / 100 = 1
                }
            }
            // If recipient add one to the message
            if (recipient)
                exec_msg.update_royalty.recipient = recipient;

            let msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                state.privAuctionContract,
                exec_msg
            )

            const result = await connectedWallet.post({
                msgs: [msg],
                feeDenoms: 'uusd',
                gasPrices: new Coin("uusd", "0.15")

            })
            setUpdateInfo("Successfully updated")
     //       console.log(result)
        } catch (e) {
            setUpdateInfo("Error be sure to have enough LUNA to pay fees, Rayalty fee are only from 0 up to 10% max")
        //   console.log(e)
        }
    }

    return (
        <>
            <section className="nfts-big d-flex" style={{ minHeight: '100vh' }}>
                <div className="container align-self-center w-100">
                    <div className="row">
                        <div className="col-md-8 intro mx-auto text-center">                            
                            <h1 className="mb-4">
                            <span className="pink">Royalty</span> Settings
                            </h1>
                     
                            <p className="slogan fs-5">
                                NFTs can be programmed so that each transaction includes royalties, allowing creators to be rewarded fairly for their work online.
                                You can update your royalties on <strong>Curio</strong> at any time.
                            </p>
                        </div>
                        <div className="col-md-8 mx-auto">
                            <div className="col-12 mb-3">
                                <label>Recipient address</label>
                                <small className="ms-2">
                                    <span style={{color:'#20ff93'}}>optional</span> 
                                </small>
                                <small style={{opacity:0.5, fontSize:'13px', display:'block'}}>
                                By default is the contract minter
                                </small>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="charity_address"
                                    placeholder="terra12345........."
                                    onChange={event => setRecipient(event.target.value)}
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <label>Royalty fee</label>
                                <small className="ms-2" style={{color:'#ff36ff'}}>
                                    required
                                </small>
                                <small style={{opacity:0.5, fontSize:'13px', display:'block'}}>
                                Percentage amount, from 0 to max 10 % (if you need a custom amount email us at contact@curio.art)
                                </small>
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    max="10"
                                    placeholder="0"
                                    className="form-control"
                                    name="charity_address"
                                    onChange={event => setFee(event.target.value)}
                                />
                            </div>
                            <div className="col-12 my-1">
                            { updateInfo &&
                                <div
                                style={{
                                    fontSize:14,
                                    margin:0,
                                    color:'red'
                                }}
                                >{updateInfo}</div>
                            }
                            </div>
                            <div className="col-12 mb-3 mt-5">
                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={() => update_royalty()}
                                >
                                    Update Royalty Now {fee}%
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
