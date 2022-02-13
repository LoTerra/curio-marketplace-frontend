import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import {
    Coin,
    LCDClient,
    MsgExecuteContract,
    WasmAPI,
} from '@terra-money/terra.js'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider'
import numeral from 'numeral'
import { ArrowLeft } from 'phosphor-react'
import Animation from '../components/Minting/Animation'
import SmallCountdown from '../components/SmallCountdown'

export default (props) => {
    const {state, dispatch } = useStore()
    const [loading, setLoading] = useState(false)
    const [launchpad, setLaunchpad] = useState()
    const [minting, setMinting] = useState(false)
    const [nftAmount, setNftAmount] = useState(1)
    const [mintedNfts, setMintedNfts] = useState([])
    const [registrationId, setRegistrationId] = useState()
    const [config, setConfig] = useState({
        admin: 'admin',
        creator: 'creator',
        collector_fee_address: 'collector_fee_address',
        terrand_contract: 'terrand_contract',
        cw721_address: 'cw721_address',
        sity_address: 'sity_address',
        denom: 'uusd',
        mint_price: '0',
        mint_start: 1643294735,
        mint_end: null,
        total_nft_collection: 0,
        sity_token_registration_required: false,
        sity_apply_fee_mint_price: '0.02',
        penality_time_refund: 600,
        collector_high_fee_public_sale: '0.05',
        collector_low_fee_private_sale: '0.015',
        terrand_fee: '0.005',
    })
    const [_state, setState] = useState({
        counter_minted: 0,
        counter_registration: 0,
        highest_token_id: 1000,
        total_terrand_worker_fees: '',
    })
    const [user, setUser] = useState({
        sity_sent: '0',
        counter_registration: 0,
    })
    const [loadMoreNFT, setLoadMoreNFT] = useState(true)
    const [lastTokenInfo, setLastTokenInfo] = useState()

    let wallet = ''
    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }

    // Get LCD from the state and not from the wallet connect since we also
    // want to show this info for not connected users
    let api
    if (state.lcd) {
        api = new WasmAPI(state.lcd.apiRequester)
    }

    // Public mint id is the contract address of the candy machine

    let { publicmintid } = useParams()


    async function get_launchpad() {
        let api_url =
            state.network == 'mainnet' ? state.liveApi : state.testnetApi
        let res = await axios.get(
            api_url + `/get-launchpad?contract=${publicmintid}`,
        )
        setLaunchpad(res.data.launchpad[0])
        console.log(res.data.launchpad[0].cw721_address)
    }

    async function get_minted_nfts(c, start_after, reload) {
        if (reload){
            setLoading(true)
            setMintedNfts([])
        }
        if (connectedWallet && connectedWallet.walletAddress) {
            try {
                const max_limit = 30

                let query = {
                    tokens: {
                        owner: connectedWallet.walletAddress,
                        limit: max_limit
                    }
                }
                if (start_after){
                    query.tokens.start_after = start_after
                }

                //let minted = { tokens: []}
                const data = await api.contractQuery(c, query)
                console.log(data)

                setLastTokenInfo(data.tokens[data.tokens.length - 1])

                if (data.tokens.length != 30){
                    setLoadMoreNFT(true)
                    setLastTokenInfo("null")
                }else{
                    setLoadMoreNFT(false)
                }

                console.log(start_after)
                //minted.tokens = [...minted.tokens, ...data.tokens]

                // if (data.tokens.length == 30) {
                //     console.log("it is")
                //     let get_more = data.tokens;
                //     let loop = true
                //
                //     console.log(get_more[get_more.length - 1])
                //
                //     while (loop){
                //         let last_element = get_more[get_more.length - 1];
                //         console.log(last_element)
                //         const query = {
                //             tokens: {
                //                 owner: connectedWallet.walletAddress,
                //                 limit: max_limit,
                //                 start_after: last_element
                //             }
                //         }
                //         const data = await api.contractQuery(c, query)
                //         console.log(data)
                //         get_more = data.tokens
                //         minted.tokens = [...minted.tokens, ...data.tokens]
                //         if (data.tokens.length != 30){
                //             loop = false
                //         }
                //     }
                // }
                data.tokens.map(async (id) => {
                    const singleToken = await api.contractQuery(c, {
                        nft_info: {
                            token_id: id,
                        },
                    })
                    //console.log(singleToken)
                    setMintedNfts((mintedNfts) => [...mintedNfts, singleToken])
                })

                setLoading(false)
                // setMintedNfts()
            } catch (e) {
                console.log(e)
            }
        }
    }

    async function register(times) {

        if (connectedWallet && connectedWallet.walletAddress) {
            //Start minting animation
            setMinting(true)

            try {
                let msgs = []
                // Allows multiple registration max 100 per transactions
                if (times > 100) {
                    return
                }
                let denom_to_key = config.denom
                let coins = {}
                coins[denom_to_key] = config.mint_price

                for (let x = 0; x < times; x++) {
                    let msg = new MsgExecuteContract(
                        connectedWallet.walletAddress,
                        publicmintid,
                        {
                            register: {},
                        },
                        coins,
                    )
                    msgs.push(msg)
                }

                const result = await connectedWallet.post({
                    msgs: msgs,
                    feeDenoms: ['uusd'],
                    gasPrices: new Coin('uusd', '0.15'),
                })

                // // Query state contract candy machine
                // const state_candy_machine = await api.contractQuery(
                //     publicmintid,
                //     {
                //         state: {},
                //     },
                // )
                // // Get the current registration id
                // setRegistrationId(state_candy_machine.counter_registration)

                //End minting animation
                setTimeout(e => {
                    setMinting(false)
                }, 30000)

            } catch (e) {
                console.log(e)
                //End minting animation
                setMinting(false)
            }
        }
    }

    async function get_registration_info() {
        let query = {
            registration: {
                registration_id: registrationId,
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
                    token_id: my_registration.token_id,
                },
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function get_all_registration_id() {
        let query = {
            registrations: {
                //start_after: registrationId
                limit: 30,
                expired: false, // true to get already minted
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
                    token_id: my_registration.token_id,
                },
            })
        } catch (e) {
            console.log(e)
        }
    }
    /*
        TODO: Read
        // We can just display all registration ?? and show it to all so they also see what others are minting
     */
    async function get_all_registration_id() {
        let query = {
            registrations: {
                //start_after: registrationId
                limit: 30,
                expired: false, // true to get already minted
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
                    token_id: my_registration.token_id,
                },
            })
        } catch (e) {
            console.log(e)
        }
    }

    // get the config candy machine
    async function get_config_candy_machine() {
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
            setConfig(config)
        } catch (e) {
            console.log(e)
        }
    }
    // get the config candy machine
    async function get_state_candy_machine() {
        let query = {
            state: {},
        }
        try {
            // Query config
            const state = await api.contractQuery(publicmintid, query)
            setState(state)
        } catch (e) {
            console.log(e)
        }
    }
    // get user info candy machine
    async function get_user_candy_machine() {
        if (connectedWallet && connectedWallet.walletAddress) {
            let query = {
                user: {
                    address: connectedWallet.walletAddress,
                },
            }
            try {
                // Query user
                const user = await api.contractQuery(publicmintid, query)
                setUser(user)
            } catch (e) {
                console.log(e)
            }
        }
    }

    useMemo(() => {
        get_launchpad()
    }, [])


    useEffect(() => {
        if (launchpad){
            get_minted_nfts(launchpad.cw721_address, null, true)
        }
        get_config_candy_machine()
        get_state_candy_machine()
        get_user_candy_machine()
        //Do stuff on mount
    }, [launchpad, minting])

    return (
        <>
            {launchpad && (
                <section
                    className="nfts-big d-flex"
                    style={{ minHeight: '100vh' }}
                >
                    <div className="container align-self-center w-100">
                        <div className="row">
                            <div className="col-md-10 mx-auto">
                                <Link
                                    to="/launchpad"
                                    className="btn btn-secondary btn-sm mb-3 px-0 text-center text-md-start"
                                    style={{
                                        fontWeight: 300,
                                        display: 'block',
                                        opacity: 0.5,
                                        background: 'transparent',
                                    }}
                                >
                                    <ArrowLeft
                                        size={16}
                                        style={{
                                            position: 'relative',
                                            top: '-1px',
                                        }}
                                    />{' '}
                                    Back to Launchpad
                                </Link>
                                <h1>Public mint</h1>
                                <div className="card nft-card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <img
                                                    src={
                                                        launchpad.background_image
                                                    }
                                                    className="img-fluid object-fit rounded"
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <img
                                                    src={launchpad.logo}
                                                    className="img-fluid object-fit"
                                                    width="100px"
                                                />
                                                <h2>{launchpad.title}</h2>
                                                <p className="text-muted">
                                                    {launchpad.description}{' '}
                                                </p>
                                                <h4>
                                                    Globally minted{' '}
                                                    <small>
                                                        ({_state.counter_registration}
                                                        /
                                                        {
                                                            config.total_nft_collection
                                                        }
                                                        )
                                                    </small>
                                                </h4>
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width:
                                                                (_state.counter_registration *
                                                                    100) /
                                                                    config.total_nft_collection +
                                                                '%',
                                                            backgroundColor:
                                                                '#ff36ff59',
                                                        }}
                                                        aria-valuenow="75"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                                <p className="text-muted mt-3 mb-0">
                                                    Minting cost
                                                </p>
                                                <h3 className="mt-0 fw-bold">
                                                    {' '}
                                                    <img
                                                        src="/img/UST.svg"
                                                        width="35px"
                                                        className="img-fluid"
                                                        style={{
                                                            marginTop: '-3px',
                                                        }}
                                                    />
                                                    {numeral(
                                                        config.mint_price /
                                                            1000000,
                                                    ).format('0,0.00')}{' '}
                                                    UST
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {launchpad && (
                                    launchpad.opening_time <
                                        Math.floor(Date.now() / 1000) &&
                                    launchpad.closing_time >
                                        Math.floor(Date.now() / 1000) ||
                                        launchpad.opening_time <
                                            Math.floor(Date.now() / 1000) &&
                                        launchpad.closing_time == null) && (
                                            <div className="card nft-card">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="card nft-card">
                                                                <div className="card-body">
                                                                    <h3 className="mb-1 fw-bold">
                                                                        Mint
                                                                    </h3>
                                                                    <p className="mb-0 text-muted">
                                                                        You have
                                                                        minted (
                                                                        {
                                                                           user.counter_registration
                                                                        }
                                                                        /
                                                                        {
                                                                            config.total_nft_collection
                                                                        }
                                                                        )
                                                                    </p>
                                                                    <div className="progress mb-3">
                                                                        {/*<div className="progress-bar" role="progressbar" style={{width:'55%'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                                                    </div>
                                                                    <input
                                                                        className="form-control"
                                                                        value={
                                                                            nftAmount
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setNftAmount(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        type="number"
                                                                        min="1"
                                                                        step="1"
                                                                    />
                                                                    <button
                                                                        className="btn btn-primary w-100 mt-3"
                                                                        onClick={() =>
                                                                            register(
                                                                                nftAmount,
                                                                            )
                                                                        }
                                                                    >
                                                                        Mint
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="card nft-card">
                                                                <div className="card-body">
                                                                    <h3>
                                                                        My minted
                                                                        nfts{' '}
                                                                        <small className="text-muted">
                                                                            (
                                                                            {
                                                                                user.counter_registration
                                                                            }
                                                                            )
                                                                        </small>
                                                                    </h3>
                                                                    <div className="row" style={{
                                                                        height: "500px",
                                                                        overflowY: 'scroll',
                                                                    }}>
                                                                        {mintedNfts &&
                                                                            mintedNfts.length >
                                                                                0 &&
                                                                            mintedNfts.map(
                                                                                (
                                                                                    obj,
                                                                                ) => {
                                                                                    return (
                                                                                        <div className="col-4 mb-3">
                                                                                            <img
                                                                                                src={
                                                                                                    obj.image
                                                                                                }
                                                                                                className="img-fluid rounded"
                                                                                            />
                                                                                        </div>
                                                                                    )
                                                                                },
                                                                            )}
                                                                        {mintedNfts &&
                                                                        mintedNfts.length >
                                                                        0 && (
                                                                        <button className="btn btn-primary w-100 mt-3" disabled={loadMoreNFT} onClick={() => launchpad && get_minted_nfts(launchpad.cw721_address, lastTokenInfo)}>Load more</button>)}
                                                                        { loading && (
                                                                            <div className="spinner-border text-primary" role="status">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>

                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                {launchpad &&
                                    Math.floor(Date.now() / 1000) <
                                        launchpad.opening_time && (
                                        <div className="card nft-card text-center">
                                            <div className="card-body">
                                                <p className="m-0 text-muted">
                                                    Minting not active yet
                                                </p>
                                                <SmallCountdown
                                                    start={
                                                        launchpad.opening_time
                                                    }
                                                    expiryTimestamp={Date.now()}
                                                />
                                            </div>
                                        </div>
                                    )}
                                {(launchpad &&
                                    launchpad.closing_time &&
                                    Math.floor(Date.now() / 1000) >
                                        launchpad.closing_time ||
                                    launchpad &&
                                    _state.counter_registration ==
                                        config.total_nft_collection && (
                                        <div className="card nft-card text-center">
                                            <div className="card-body">
                                                <p className="m-0 text-muted">
                                                    Sold out
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
            {/* <button onClick={() => setMinting(!minting)}>Toggle animation for test</button>  */}
            <Animation minting={minting} />
        </>
    )
}
