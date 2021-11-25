import React, {useCallback, useEffect, useState} from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'
import axios from "axios"
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper-bundle.css';




import { LCDClient, WasmAPI } from '@terra-money/terra.js'
import MainLoader from '../components/Loaders/MainLoader';
import NftInfoCard from '../components/NftInfoCard';
import { CirclesThreePlus, Coin, HourglassMedium, MonitorPlay } from 'phosphor-react';
import { Navigation, Pagination, Autoplay } from 'swiper';
 
export default () => {
  const [currentSlide, setCurrentSlide] = React.useState(0)


  const { state, dispatch } = useStore()
  const terra = state.lcd
  const api = new WasmAPI(terra.apiRequester)
    const [auctions, setAuction] = useState([])
    const [nfts, setNfts] = useState(false);
    const [loading,setLoading] = useState(true)
    

    async function getHomePageData() {
      try {
        const result = await axios.get("https://privilege.digital/api/get-items")
        console.log(result.data);       
        setNfts(result.data.filterItems)
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    }

    function nftValid(timestamp){
      let end = new Date(parseInt(timestamp) * 1000)
      let now = new Date()    
  
      if(end.getTime() < now.getTime()){
          return false
      } else {
          return true
      }
    }

  const fetchNftData = useCallback( async() => {

    

        try {
          const contractStateInfo = await api.contractQuery(
            state.privAuctionContract,
            {
                state: {},
            }          
        )
        console.log(contractStateInfo)

      
      console.log(nfts,'nfts')

          /// Min is 10 result max is 30
          const firstThirstyAuctionsInfo = await api.contractQuery(
              state.privAuctionContract,
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
          <div className="col-md-7 ps-0 ps-lg-5 d-flex intro mb-0 mb-md-5 text-start">
            <div className="align-self-center w-100">
            <div className="row">
              <div className="col-xl-7 mx-auto text-center">
                <h1><span className="green">Buy</span> or <span className="pink">Auction</span> your NFT</h1>
                <p className="slogan mb-5">We are currently in <strong>testnet mode</strong>, feel free to test with us</p>
              </div>
               <div className="col-xl-8 mx-auto">
                 <div className="row">
                 <div className="col-6 mb-4">
                <button className="btn btn-primary btn-lg w-100">Explore</button>
              </div>
              <div className="col-6 mb-4">
                <a href="/create" className="btn btn-lg btn-outline-primary w-100">Create auction</a>
              </div>
                   </div>
                 </div>
            </div>
            <div className="row mt-3 mb-5 info-row d-none d-md-flex">
            
              <div className="col-md-4 mt-4">
                <div className="row">
                  <div className="col-lg-3 text-center">
                    <span className="icon"><Coin size={60} weight="light" /></span> 
                  </div>
                  <div className="col-lg-9">
                    <p className="title">Earn privilege</p>
                    <p className="info">Creating auction or participating in auctions will earn you privilege.</p>
                  </div>
                </div>              
              </div>

              <div className="col-md-4 mt-4">
                <div className="row">
                  <div className="col-lg-3 text-center">
                    <span className="icon"><MonitorPlay size={60} weight="light" /></span> 
                  </div>
                  <div className="col-lg-9">
                    <p className="title">Start bidding</p>
                    <p className="info">Participate in auctions and earn privilege, unlock private auctions with privilege</p>
                  </div>
                </div>              
              </div>

              <div className="col-md-4 mt-4">
                <div className="row">
                  <div className="col-lg-3 text-center">
                    <span className="icon"><CirclesThreePlus size={60} weight="light" /></span> 
                  </div>
                  <div className="col-lg-9">
                    <p className="title">Create auction</p>
                    <p className="info">Everyone will be able to sell their nfts on the privilege marketplace</p>
                  </div>
                </div>              
              </div>

            </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="row">
            <div className="col-md-12 heading">
            <h3>Featured</h3>
          </div>
            </div>
          {nfts.length > 0 &&
            <Swiper
            modules={[Navigation, Pagination,Autoplay]}
            spaceBetween={25} 
            slidesPerView={2}           
            pagination={{ clickable: true }}
            navigation={false} 
            loop={true}
            autoplay={{ delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
             }}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}            
            breakpoints={{
              // when window width is >= 640px
              1: {         
                slidesPerView: 1,
              },
              // when window width is >= 768px
              768: {    
                slidesPerView: 1,
              },
              1000: {    
                slidesPerView: 1,
              },
              1300: {    
                slidesPerView: 2,
              },
            }}     
          >
    {
                        nfts.filter((a)=>{
                          if(nftValid(a.end_time)){
                          return true;
                          }
                          return false;
                                              
                      }).sort((a,b) => {return a.end_time - b.end_time}).slice(0,12).map((obj, id) =>{           
                            return (
                              <SwiperSlide>
                                <NftInfoCard key={id} data={obj} type={'xs'} index={99}/>
                              </SwiperSlide>)            
                        })
                      }
                     
                      </Swiper>
}
          </div>
          <div className="col-md-12 small-heading">
            <h3><span className="icon"><HourglassMedium size={38} color="#ff36ff" /> <HourglassMedium size={38} color="#20ff93" /></span> Almost ending</h3>
          </div>
          <div className="col-md-12">
          <div className="row">
            {nfts.length > 0 &&
            <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={25}
            slidesPerView={6}
            loop={true}
            breakpoints={{
              // when window width is >= 640px
              1: {         
                slidesPerView: 1,
              },
              // when window width is >= 768px
              768: {    
                slidesPerView: 2,
              },
              1000: {    
                slidesPerView: 6,
              },
            }}
            pagination={{ clickable: true }}
            navigation={false}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
    {
                        nfts.filter((a)=>{
                          if(nftValid(a.end_time)){
                          return true;
                          }
                          return false;
                                              
                      }).sort((a,b) => {return a.end_time - b.end_time}).slice(0,12).map((obj, id) =>{           
                            return (
                              <SwiperSlide>
                                <NftCard key={id} data={obj} type={'xs'} index={99}/>
                              </SwiperSlide>)            
                        })
                      }
                      </Swiper>
}
     
      </div>
            </div>
            <div className="col-md-12 heading">
            <h3>Explore by category</h3>
          </div>
          <div className="col-md-12 mx-auto">
          <ul className="nav nav-pills nav-pills-categories nav-justify mb-3" id="pills-tab" role="tablist">
            { state.categories.map((obj,i) => {
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
        { state.categories.map((obj,i) => {
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
  <MainLoader loading={loading}/>
  </>
  )
}
  

