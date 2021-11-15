import React, {useCallback, useEffect, useState} from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'
import axios from "axios"




import { LCDClient, WasmAPI } from '@terra-money/terra.js'

export default () => {

  const { state, dispatch } = useStore()
  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)
    const [auctions, setAuction] = useState([])
    const [nfts, setNfts] = useState(false);
    let cat = ["Undefined", "Art", "Photography", "Metaverses", "Games", "Music", "Domains", "DeFi", "Memes", "Punks"]

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
    <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 intro mb-0 mb-md-5 mx-auto text-center">
            <h1><span className="green">Buy</span> or <span className="pink">Auction</span> your NFT</h1>
            <p className="slogan">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
          </div>
          <div className="col-md-12 mx-auto">
          <ul className="nav nav-pills nav-pills-categories nav-justify mb-3" id="pills-tab" role="tablist">
            { cat.map((obj,i) => {
               return ( <li className="nav-item" role="presentation">
               <button className={i == 0 ? "nav-link active" : "nav-link"} id={"pills-tab-"+i} data-bs-toggle="pill" data-bs-target={"#pills-content-"+i} type="button" role="tab" aria-controls="pills-create" aria-selected="true">
                 {obj}
                  <small style={{fontSize:'12px', opacity:0.5}}>
                    ({nfts && obj !== 'Undefined' && nfts.filter((a) => {return a.category == obj} ).length}
                    {nfts && obj === 'Undefined' &&  nfts.filter((a) => {return a.category == null} ).length})
                    </small>
                    </button>
             </li>)
            })

            }

</ul>
          </div>
        </div>
        <div className="tab-content" id="pills-tabContent">
        { cat.map((obj,i) => {
               return ( 
                <div className={i == 0 ? "tab-pane fade show active" : "tab-pane fade"} id={"pills-content-"+i} role="tabpanel" aria-labelledby={"pills-tab-"+i}>
                <div className="row">
                  {
                        nfts.length > 0 && nfts.filter((a) => {return obj !== "Undefined" ? a.category == obj : a.category == null} ).map((obj, id) =>{           
                            return (
                              <div className={'col-md-3'}>
                                <NftCard key={id} data={obj} type={'small'} index={99}/>
                              </div>)            
                        })
                      }
                
                </div>
                </div>
               )
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
  

