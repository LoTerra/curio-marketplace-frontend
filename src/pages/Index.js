import React, {useCallback, useEffect, useState} from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'
import axios from "axios"
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { LCDClient, WasmAPI } from '@terra-money/terra.js'

export default () => {

  const { state, dispatch } = useStore()
  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)
    const [auctions, setAuction] = useState([])
    const [nfts, setNfts] = useState(false);


    async function getHomePageData() {
      try {
        const result = await axios.get("https://privilege.digital/api/get-items")
        console.log(result.data);
        setNfts(result.data.filterItems)
      } catch (error) {
        console.error(error);
      }
    }


  const fetchNftData = useCallback( async() => {

    

        try {
          const contractStateInfo = await api.contractQuery(
            state.privTokenContract,
            {
                state: {},
            }          
        )
        console.log(contractStateInfo)

      
      console.log(nfts,'nfts')

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
    getHomePageData()
}, [fetchNftData])
  return (
<>

  <section className="nfts-big">
    <div className="container">
        <div className="row">
          <div className="col-md-10 intro mb-0 mb-md-5 mx-auto text-center">
            <h1><span className="green">Buy</span> or <span className="pink">Auction</span> your NFT</h1>
            <p className="slogan">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
          </div>
          <BrowserView className="row">
          {
                nfts.length > 0 && nfts.map((obj, id) =>{           
                    return (
                      <div className="col-md-4">
                        <NftCard key={id} data={obj} type={'small'} index={99}/>
                      </div>)            
                })
              }
          </BrowserView>
          <MobileView>
          <Carousel showThumbs={false}>
              {
                nfts.length > 0 && nfts.map((obj, id) =>{           
                    return (
                      <div className="col-md-4">
                        <NftCard key={id} data={obj} type={'small'} index={99}/>
                      </div>)            
                })
              }
          </Carousel>
          </MobileView>
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
  

