import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useStore } from '../../store'
import toast, { Toaster } from 'react-hot-toast';
import { useWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import contractData from '../../contracts.json';

import debounce from 'lodash.debounce';

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
import { ArrowsClockwise, Check, CheckCircle, CheckSquareOffset, Heart, SlidersHorizontal, WarningCircle, X } from 'phosphor-react';

const  INTERVAL = 1000;


export default function CreateAuction(props) {

    const { state, dispatch } = useStore()

    const [listView,setListView] = useState(true)
    const [contractAddress, setContractAddress] = useState("")
    const [selectedContract,setSelectContract] = useState()

    const [contract, setContract] = useState({
        contract: {},
        address: ''
    })

    const [manual,setManual] = useState(false)
    const [tokenId, setTokenId] = useState("")
    const [userNfts, setUserNfts] = useState([])
    const [contracts, setContracts] = useState([])
    const [nftLoader, setNftLoader] = useState(false);

    const closeRef = useRef();

    
    

    let network = ''
    let connectedWallet = '' 

  
    if (typeof document !== 'undefined') {
        network = useWallet().network;
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


    async function getNftProviderData(address){
        //Clean before new data
   
        setUserNfts([])
        setTokenId("")
        
        //Spread operator
        let data = [];
        try{
      
            const api = new WasmAPI(lcd.apiRequester)  
            const tokenData = await api.contractQuery(
                address, 
                {
                    tokens: {
                        owner: connectedWallet.walletAddress,
                        limit: 30,
                    }
                }
                )
                console.log(tokenData)
            
                tokenData.tokens.map(async (obj) => {
                    const singleToken = await api.contractQuery(
                        address, 
                        {
                            nft_info: {
                                token_id: obj,                                
                            }
                        }
                        )
                        singleToken.token_id = obj
                        data.push(singleToken)
                        setUserNfts(userNfts => [...userNfts,singleToken])       
                })             

                
                console.log(userNfts)
                if(tokenData && tokenData.tokens.length === 0){
                    toast.error('No NFTS found on contract')
                }
                setNftLoader(false)
            } catch(e){
                setUserNfts([])
                toast.error('Error')
                console.log(e)
                setNftLoader(false)
            }
            
    }

    function selectNftContract(obj){
        console.log(obj)
        // setContractAddress(obj.contract);        
        // setSelectContract(obj)    
        setContract(prevValues => {
            return {...prevValues,contract:obj,address:obj.contract}
        })
        closeRef.current.click();
        getNftProviderData(obj.contract)
        
    }



    const debouncedClick = useCallback(debounce(() => {
        setNftLoader(true)
        getNftProviderData(contract.address)
      }, INTERVAL));
      

    function getContractData(){
        if(connectedWallet){
            console.log(connectedWallet.network.name)
            setContracts([])
            let contracts_json = JSON.parse(JSON.stringify(contractData));
            let data = contracts_json[connectedWallet.network.name];           

            Object.keys(data[0]).map(key => {             
                setContracts(contracts => [...contracts, data[0][key]])
            })

            console.log(connectedWallet.network, contracts)
        }
    }


    async function create(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target).entries());
        console.log(data)

      if (!connectedWallet) {
            toast.error('Connect your wallet')
           return false;
      }

      if(contractAddress === ''){
          toast.error('NFT Contract Address needs to be filled')
          return false;
      }

      if(tokenId === ''){
        toast.error('NFT Token ID needs to be filled')
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
                contract: state.privAuctionContract,
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

  

    useEffect(() => {
       
      }, [userNfts, contracts,contract]);

    return (       
        <>
        
        { connectedWallet && connectedWallet.walletAddress ? 

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
   
<div className="row">
    <div className="col-md-6">
    <button type="button" className="btn btn-primary btn-block btn-lg w-100" onClick={() => getContractData()} data-bs-toggle="modal" data-bs-target="#nftContracts">Add NFT</button>
    </div>
    <div className="col-md-6">
    <button type="button" className={'btn btn-secondary d-block btn-lg w-100'} onClick={() => setManual(!manual)}>Add NFT Manually</button>
    </div>
</div>


<div class="modal fade" id="nftContracts" tabindex="-1" aria-labelledby="nftContractsLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="nftContractsLabel">Select NFT Contract</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" ref={closeRef} aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div className="row">
            <div className="col-12">
                <div className="btn-group d-block w-100 mb-3">
                    <button type="button" className={"btn btn-secondary w-50" + (listView ? ' active' : '')} onClick={() => setListView(true)}>List view</button>
                    <button type="button" className={"btn btn-secondary w-50" + (!listView ? ' active' : '')} onClick={() => setListView(false)}>Grid view</button>
                </div>
            </div>
            {contracts && contracts.length > 0 && contracts.map((obj,k) => 
                listView ?
                (<div className="col-md-12 text-start nft-contract-thumb list-view" key={k}>
                <a className={'text-white d-block ' + (obj.contract == contractAddress ? ' active' : '')} onClick={() => selectNftContract(obj)}>
                        <img src={obj.icon} className="d-inline-block img-fluid" width="40" />
                        {obj.name}               
                    </a>
                </div>)
                :
                (
                    <div className="col-md-3 text-center nft-contract-thumb grid-view" key={k}>
                <a className={'text-white d-block ' + (obj.contract == contractAddress ? ' active' : '')} onClick={() => selectNftContract(obj)}>
                    <div className="row">
                        <div className="col-md-12"><img src={obj.icon} className="d-block img-fluid" /></div>
                        <div className="col-md-12 mb-3">{obj.name}</div>
                    </div>
                    
                    
                    </a>
                </div>
                )
            )}           
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>



{ contract.contract && contract.contract !== '' &&
    <div className="card bg-dark">
        <div className="card-body">
            <div className="row">
                <div className="col-3">
                    <img src={contract.contract.icon} className="img-fluid"/>
                </div>
                <div className="col-9">
                <p className="m-0"><strong>Selected contract: </strong></p>
            <h3>{contract.contract.name}</h3>
            <p>{contract.contract.contract}</p>
                </div>
            </div>
            
        </div>
    </div>
}
            
            {contract.address !== '' &&
                <button type="button" className="btn btn-secondary btn-lg w-100 my-2" onClick={() => debouncedClick()}><ArrowsClockwise color={'#20ff93'} size={21} weight={'bold'} style={{position:'relative',top:'-2px'}} /> Get nfts from contract</button>
            }
        </div>
      
            <div className="col-12">
                { nftLoader &&
                  <div className="row">
                      <div className="col-12 text-center">
                      <div class="spinner-border text-primary " role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                          </div>
                      </div>
                }
                <div className="row">
                    { userNfts && userNfts.length > 0 &&
                        <p><strong>Select NFT You want to auction</strong></p>
                    }
                {userNfts && userNfts.length > 0 && userNfts.map((obj,k) => 
(<div className="col-md-3" key={k}>
<div className={'nft-thumb' + (tokenId && tokenId == obj.token_id ? ' active' : '')} onClick={() => setTokenId(obj.token_id)}>
    { tokenId && tokenId == obj.token_id &&
        <span className="nft-selected"> <Check size={24} weight={'bold'}/> </span>
    }
<img src={obj.image} className="img-fluid"/>
<p>{obj.name}</p>
</div>
</div>      )                  
                
                    )
                }
                </div>
            </div>
        
        <div className="col-12 mb-3 mt-2">
            
            {manual &&
            <>
            <label>Contract address</label>
            <input type="text" className="form-control" value={contractAddress} onChange={(e) =>setContractAddress(e.target.value)} name="contract_address" required />
            <label>Token ID</label>
            <input type="text" className="form-control" value={tokenId} onChange={(e) => setTokenId(e.target.value)} name="token_id" required />
            </>
            }
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
    { contractAddress !== '' && tokenId !== '' &&
        <>
        <div className="col-md-3"></div>
        <div className="col-md-9">
            <div className="success-message">
                <p><CheckCircle size={21} /> Nft selected, you can now setup the rest of your auction</p>
            </div>
        </div>
        </>
    }
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
                <button type="button" type="submit" className="btn btn-primary btn-lg w-100">Create</button>
            </div>
        </div>
    </div>
</div>



</form>

:

<div className="col-12 p-4 text-center">
<p><WarningCircle size={24}/> You need to connect your wallet in order to create an auction</p>
</div>

        }
          <Toaster/>        
                     
                </>
    )
}