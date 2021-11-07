import React, {useCallback, useEffect, useState} from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'

import { LCDClient, WasmAPI } from '@terra-money/terra.js'

export default () => {

  const { state, dispatch } = useStore()
  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)
    const [auctions, setAuction] = useState([])

  const fetchNftData = useCallback( async() => {
        try {
          const contractStateInfo = await api.contractQuery(
            state.privTokenContract,
            {
                state: {},
            }          
        )
        console.log(contractStateInfo)

          /// Min is 10 result max is 30
          const firstThirstyAuctionsInfo = await api.contractQuery(
              state.privTokenContract,
              {
                all_auctions: {
                  // start_after: 0, // For pagination you can set the id you want here and receive next 30 auctions
                  limit: 30
                },
              }
          )
            console.log(firstThirstyAuctionsInfo.auctions)
          dispatch({ type: 'setAuctions', message: firstThirstyAuctionsInfo.auctions })
            setAuction(firstThirstyAuctionsInfo.auctions )
        } catch {

        }
  }, [])
  useEffect(() => {
    fetchNftData()
}, [fetchNftData])
  return (
<>

  <section className="nfts-big">
    <div className="container">
        <div className="row">
          <div className="col-md-10 intro mx-auto text-center">
            <h1><span className="green">Buy</span> or <span className="pink">Auction</span> your NFT</h1>
            <p className="slogan">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
          </div>
         
              {
                auctions.map((obj, id) =>{           
                    return (
                      <div className="col-md-4">
                        <NftCard key={id} data={obj} type={'small'} index={99}/>
                      </div>)            
                })
              }
     
        </div>
      </div>
  </section>

  {/*<section className="nfts">*/}
  {/*  <div className="container">*/}
  {/*    <div className="row">*/}
  {/*      <div className="col-md-12">*/}
  {/*      <div className="heading">*/}
  {/*          <h3>Category name</h3>*/}
  {/*          <p>Here comes a little description about the category</p>*/}
  {/*        </div>*/}
  {/*      </div>*/}
  {/*        { state.auctions && state.auctions.slice(0,4).map((obj,key) => {*/}
  {/*          return (*/}
  {/*            <div className="col-md-3">*/}
  {/*              <NftCard key={key} type={'small'} data={obj} index={key}/>*/}
  {/*            </div>*/}
  {/*          )*/}
  {/*        })}*/}
  {/*    </div>*/}
  {/*  </div>*/}
  {/*</section>*/}

  {/*<section className="nfts">*/}
  {/*  <div className="container">*/}
  {/*    <div className="row">*/}
  {/*      <div className="col-md-12">*/}
  {/*        <div className="heading">*/}
  {/*          <h3>Category name</h3>*/}
  {/*          <p>Here comes a little description about the category</p>*/}
  {/*        </div>*/}
  {/*      </div>*/}
  {/*        { state.auctions && state.auctions.slice(0,4).map((obj,key) => {*/}
  {/*          return (*/}
  {/*            <div className="col-md-3">*/}
  {/*              <NftCard key={key} type={'small'} data={obj} index={key}/>*/}
  {/*            </div>*/}
  {/*          )*/}
  {/*        })}*/}
  {/*    </div>*/}
  {/*  </div>*/}
  {/*</section>*/}
  </>
  )
}
  

