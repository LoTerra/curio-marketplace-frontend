import React, {useEffect, useMemo, useState} from 'react'
import { useStore } from '../store'
import {  
    useParams
  } from "react-router-dom";
import axios from "axios";
import {Coin, LCDClient, MsgExecuteContract, WasmAPI} from "@terra-money/terra.js";
import {useConnectedWallet, useWallet} from "@terra-money/wallet-provider";

export default (props) => {

    const { state, dispatch } = useStore()
    const [launchpad, SetLaunchpad] = useState(
        {
            launchpad_contract: "",
            cw721_contract: "",
            title: "",
            subtitle: "",
            description: "",
            restricted: false,
            logo: "",
            background_image: "",
            creator: {
                address: "",
                url: "",
                twitter: "",
                telegram: "",
                discord: "",
                email: "",
                dribble: ""
            },
            opening_time: Date.now(),
            closing_time: Date.now()
        }
    )
    const [registrationId, SetRegistrationId] = useState()

    let wallet = ''
    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }
    const lcd = useMemo(() => {
        if (!connectedWallet) {
            return null
        }

        return new LCDClient({
            URL: connectedWallet.network.lcd,
            chainID: connectedWallet.network.chainID,
        })
    }, [connectedWallet])
    const api = new WasmAPI(lcd.apiRequester)

    // Public mint id is the contract address of the candy machine
    let {publicmintid} = useParams()

    async function get_launchpad(){
        let res = await axios.get(`https://privilege.digital/api/get-launchpad?contract=${publicmintid}`);
        SetLaunchpad(res.data);
    }

    async function register(){
        if (connectedWallet && connectedWallet.walletAddress) {

            try {
                let msg = new MsgExecuteContract(
                    connectedWallet.walletAddress,
                    publicmintid,
                    {
                        register: {},
                    },
                );

                const result = await connectedWallet.post({
                    msgs: [msg],
                    feeDenoms: ['uusd'],
                    gasPrices: new Coin("uusd", "0.15")
                })
                // Query state contract candy machine
                const state_candy_machine = await api.contractQuery(publicmintid, {
                    state:{}
                })
                // Get the current registration id
                SetRegistrationId(state_candy_machine.counter_registration)

                /*
                    TODO: Display a message we are minting your NFT blablabla...
                    After 30 seconds to 1 mint Display the image of the NFT minted
                 */
            }catch (e) {
                console.log(e)
            }
        }
    }

    async function get_registration_info(){
        let query = {
            registration: {
                registration_id: registrationId
            },
        }
        try {
            /*
                @param: RegistrationInfoResponse
                address: String,
                terrand_round: u64,
                expire: u64,
                is_refunded: bool,
                amount_sent: Uint128,
                sity_sent: Option<Uint128>,
                token_id: Option<String>,
             */
            // Query registration
            const my_registration = await api.contractQuery(publicmintid, query)
            // Query the NFT info
            const NFT = await api.contractQuery(launchpad.cw721_contract, {
                token_info: {
                    token_id: my_registration.token_id
                }
            })
        }catch (e) {
            console.log(e)
        }
    }

    async function get_all_registration_id(){
        let query = {
            registrations: {
                //start_after: registrationId
                limit: 30,
                expired: false // true to get already minted
            },
        }
        try {
            /*
                @param: RegistrationInfoResponse
                address: String,
                terrand_round: u64,
                expire: u64,
                is_refunded: bool,
                amount_sent: Uint128,
                sity_sent: Option<Uint128>,
                token_id: Option<String>,
             */
            // Query registration
            const my_registration = await api.contractQuery(publicmintid, query)
            // Query the NFT info
            const NFT = await api.contractQuery(launchpad.cw721_contract, {
                token_info: {
                    token_id: my_registration.token_id
                }
            })
        }catch (e) {
            console.log(e)
        }
    // }
    /*
        We can just display all registration ?? and show it to all so they also see what others are minting
     */
    async function get_all_registration_id(){
        let query = {
            registrations: {
                //start_after: registrationId
                limit: 30,
                expired: false // true to get already minted
            },
        }
        try {
            /*
                @param: RegistrationInfoResponse
                address: String,
                terrand_round: u64,
                expire: u64,
                is_refunded: bool,
                amount_sent: Uint128,
                sity_sent: Option<Uint128>,
                token_id: Option<String>,
             */
            // Query registration
            const my_registration = await api.contractQuery(publicmintid, query)
            // Query the NFT info
            const NFT = await api.contractQuery(launchpad.cw721_contract, {
                token_info: {
                    token_id: my_registration.token_id
                }
            })
        }catch (e) {
            console.log(e)
        }
    }

    // get the config candy machine
    async function get_config_candy_machine(){
        let query = {
            config: {},
        }
        try {
            /*
                @param: ConfigInfoResponse
                pub creator: String,
                pub denom: String,
                pub collector_fee_address: String,
                pub terrand_address: String,
                pub cw721_address: String,
                pub sity_address: String,
                pub mint_price: Uint128,
                pub mint_start: u64,
                pub mint_end: Option<u64>,
                pub total_nft_collection: u64,
                pub sity_token_registration_required: bool,
                pub sity_apply_fee_mint_price: Decimal,
                pub penality_time_refund: u64,
                pub collector_high_fee_public_sale: Decimal,
                pub collector_low_fee_private_sale: Decimal,
                pub terrand_fee: Decimal,
             */
            // Query config
            const config = await api.contractQuery(publicmintid, query)

        }catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        //Do stuff on mount
        get_launchpad()
    },[])

    return (
        <>
            <section className="nfts-big d-flex" style={{ minHeight: '100vh' }}>
                <div className="container align-self-center w-100">
                    <div className="row">
                        <div className="col-md-10 mx-auto">
                            <h1>Public mint</h1>
                            <div className="card nft-card">
                                <div className="card-body">
                                    <div className="row">
                                    <div className="col-md-4">
                                        <img src="https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" className="img-fluid object-fit"/>
                                      
                                    </div>
                                    <div className="col-md-8">
                                        <h2>Project title</h2>
                                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt porta feugiat. Vestibulum suscipit sollicitudin odio, vitae interdum massa placerat vitae. Etiam leo nibh, hendrerit tempor orci non, auctor feugiat tellus. </p>
                                        <h4>Globally minted <small>(300/400)</small></h4>
                                        <div className="progress">
                                            <div className="progress-bar" role="progressbar" style={{width:'75%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <p className="text-muted mt-3 mb-0">Minting cost</p>
                                        <h3 className="mt-0 fw-bold">     <img
                                    src="/img/UST.svg"
                                    width="35px"
                                    className="img-fluid"
                                    style={{
                                        marginTop:'-3px'
                                    }}
                                />140 UST</h3>
                                    </div>
                                    </div>
                                </div>
                            </div>   
                            <div className="card nft-card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h3 className="mb-1 fw-bold">Mint</h3>
                                            <p className="mb-0 text-muted">You have minted (1/3)</p>
                                            <div className="progress mb-3">
                                            <div className="progress-bar" role="progressbar" style={{width:'55%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <input className="form-control"/>
                              <button className="btn btn-primary w-100 mt-3" style={{background:'#ff36ff',color:'#fff'}}>Mint</button>
                     
                                        </div>
                                        <div className="col-md-6">
                                            <h3 className="mb-1 fw-bold">Claim</h3>
                                            <p className="mb-0 text-muted">You have claimed (1/3)</p>
                                            <div className="progress mb-3">
                                            <div className="progress-bar" role="progressbar" style={{width:'25%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                            <input className="form-control"/>
                                            <button className="btn btn-primary w-100 mt-3">Claim</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
