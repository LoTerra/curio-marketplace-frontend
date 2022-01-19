import React, { useState} from 'react'
import CreateAuction from '../components/Create/CreateAuction'
import MintNft from '../components/Create/MintNft'
import {Coin, MsgExecuteContract} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";
import {useStore} from "../store";

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
            console.log(result)
        } catch (e) {
            setUpdateInfo("Error be sure to have enough LUNA to pay fees, fees are only from 0 up to 10% max")
           console.log(e)
        }
    }

    return (
        <>
            <section className="nfts-big d-flex" style={{ minHeight: '100vh' }}>
                <div className="container align-self-center w-100">
                    <div className="row">
                        <div className="col-md-10 intro mx-auto text-center">
                            <h1>
                                <span className="pink">Royalty</span> update
                            </h1>
                            <p className="badge">BETA MODE</p>
                            <p className="slogan fs-5">
                                NFTs can be programmed so that each transaction includes royalties, allowing creators to be rewarded fairly for their work online.
                                You can update at anytime your Royalty.
                            </p>
                        </div>
                        <div className="col-md-10 mx-auto">
                            <div className="col-12 mb-3">
                                <label>Recipient address</label>
                                <small className="ms-2">
                                    optional (By default is the contract minter)
                                </small>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="charity_address"
                                    onChange={event => setRecipient(event.target.value)}
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <label>Royalty fee</label>
                                <small className="ms-2">
                                    Required (Percentage amount | From 0 to Max 10 % if you need a custom amount email us at contact@curio.art)
                                </small>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="charity_address"
                                    onChange={event => setFee(event.target.value)}
                                />
                            </div>
                            <div className="col-12 mb-3">
                                <h3>{updateInfo}</h3>
                            </div>
                            <div className="col-12 mb-3">
                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={() => update_royalty()}
                                >
                                    Update Royalty Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
