import React, { useCallback, useEffect, useRef, useState } from 'react'
import NftCard from '../components/NftCard'
import { useStore } from '../store'
import axios from 'axios'
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { LCDClient, WasmAPI } from '@terra-money/terra.js'
import MainLoader from '../components/Loaders/MainLoader'
import NftInfoCard from '../components/NftInfoCard'
import {
    CirclesThreePlus,
    Clock,
    Coin,
    Fire,
    HourglassMedium,
    MonitorPlay, Rocket,
} from 'phosphor-react'
import { Navigation, Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.css'
import CollectionSearch from '../components/CollectionSearch'
import { Link } from 'react-router-dom'

export default () => {
    const [currentSlide, setCurrentSlide] = React.useState(0)

    const { state, dispatch } = useStore()
    const terra = state.lcd
    const api = new WasmAPI(terra.apiRequester)
    const [auctions, setAuction] = useState([])
    const [nfts, setNfts] = useState([])
    const [loading, setLoading] = useState(true)
    let api_url = state.network == 'mainnet' ? state.liveApi : state.testnetApi

    const exploreDiv = useRef(null)

    async function getHomePageData() {
        try {
            const result = await axios.get(api_url + '/get-items')
            // console.log(result.data)
            setNfts(result.data.filterItems)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    function nftValid(end, start) {
        let ending = new Date(parseInt(end) * 1000)
        let starting = new Date(parseInt(start) * 1000)
        let now = new Date()

        //If ending is lower then filter
        if (ending.getTime() < now.getTime()) {
            return false
        }

        //If starting is higher then filter
        if (starting.getTime() > now.getTime()) {
            return false
        }

        //If valid return true
        return true
    }

    function nftValidEnd(end) {
        let ending = new Date(parseInt(end) * 1000)
        let now = new Date()

        //If ending is lower then filter
        if (ending.getTime() < now.getTime()) {
            return false
        }

        //If valid return true
        return true
    }

    const scrollToExplore = () => {
        exploreDiv.current.scrollIntoView()
    }

    const fetchNftData = useCallback(async () => {
        try {
            const contractStateInfo = await api.contractQuery(
                state.network == 'mainnet'
                    ? state.privAuctionContract
                    : state.testnetPrivAuctionContract,
                {
                    state: {},
                },
            )
            // console.log(contractStateInfo)

            // console.log(nfts, 'nfts')

            /// Min is 10 result max is 30
            const firstThirstyAuctionsInfo = await api.contractQuery(
                state.network == 'mainnet'
                    ? state.privAuctionContract
                    : state.testnetPrivAuctionContract,
                {
                    all_auctions: {
                        // start_after: 0, // For pagination you can set the id you want here and receive next 30 auctions
                        limit: 30,
                    },
                },
            )
            //console.log(firstThirstyAuctionsInfo.auctions)
            dispatch({
                type: 'setAuctions',
                message: firstThirstyAuctionsInfo.auctions,
            })
            setAuction(firstThirstyAuctionsInfo.auctions)
        } catch {}
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
                        <div className="col-md-7 px-lg-5 d-flex intro mb-0 mb-md-5 text-start">
                            <div className="align-self-center w-100">
                                <div className="row">
                                    <div className="col-xl-12 mt-5 mx-auto text-center">
                                        <h1>
                                            <span className="green">Buy</span>{' '}
                                            or{' '}
                                            <span className="pink">
                                                Auction
                                            </span>{' '}
                                            your NFT
                                        </h1>
                                        <p className="slogan">
                                            Find a rare, unusual, or intriguing
                                            NFT on Curio decentralized
                                            marketplace.
                                        </p>

                                        <p className="powered">
                                            <span style={{ opacity: 0.5 }}>
                                                powered by
                                            </span>{' '}
                                            <img
                                                src={'img/terralogo.svg'}
                                                style={{
                                                    width: '80px',
                                                    opacity: 0.5,
                                                }}
                                            />
                                        </p>
                                    </div>
                                    <div className="col-xl-8 mx-auto">
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                {/* <CollectionSearch/> */}
                                            </div>
                                            <div className="col-4 mb-4">
                                                <button
                                                    className="btn btn-primary btn-lg w-100"
                                                    onClick={() =>
                                                        scrollToExplore()
                                                    }
                                                >
                                                    Explore
                                                </button>
                                            </div>
                                            <div className="col-4 mb-4">
                                                <Link
                                                    to="/create"
                                                    className="btn btn-lg btn-outline-primary w-100"
                                                >
                                                    Create auction
                                                </Link>
                                            </div>
                                            <div className="col-4 mb-4">
                                                <Link
                                                    to="/launchpad"
                                                    className="btn btn-lg btn-outline-primary w-100"
                                                >
                                                    <Rocket size={16} weight="bold" />{' '}
                                                    Launchpad
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3 mb-5 info-row d-none d-md-flex">
                                    <div className="col-md-4 mt-4">
                                        <div className="row">
                                            <div className="col-lg-3 text-center">
                                                <span className="icon">
                                                    <Coin
                                                        size={60}
                                                        color={'#4d4d4f'}
                                                        weight="light"
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-lg-9">
                                                <p className="title">
                                                    Curio Token
                                                </p>
                                                <p className="info">
                                                    When you want to attend a
                                                    private auction you will
                                                    need SITY tokens in order to
                                                    unlock the private auction
                                                    and participate
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mt-4">
                                        <div className="row">
                                            <div className="col-lg-3 text-center">
                                                <span className="icon">
                                                    <MonitorPlay
                                                        size={60}
                                                        color={'#4d4d4f'}
                                                        weight="light"
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-lg-9">
                                                <p className="title">
                                                    Start Bidding
                                                </p>
                                                <p className="info">
                                                    Get your NFT right now!
                                                    Place a bid on your desired
                                                    NFT, after your first bid
                                                    your new bids will compound
                                                    with the allready bidded
                                                    amount.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mt-4">
                                        <div className="row">
                                            <div className="col-lg-3 text-center">
                                                <span className="icon">
                                                    <CirclesThreePlus
                                                        size={60}
                                                        color={'#4d4d4f'}
                                                        weight="light"
                                                    />
                                                </span>
                                            </div>
                                            <div className="col-lg-9">
                                                <p className="title">
                                                    Create Auction
                                                </p>
                                                <p className="info">
                                                    Everyone will be able to
                                                    sell their nfts on the Curio
                                                    marketplace, setup your
                                                    desired start time or even
                                                    select a fee for your
                                                    favorite charity
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="row">
                                <div className="col-md-12 heading text-start">
                                    <h3>
                                        <Fire size={36} color={'#fff'} />{' '}
                                        Featured
                                    </h3>
                                </div>
                            </div>
                            {nfts.length > 0 && (
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={25}
                                    slidesPerView={2}
                                    pagination={{ clickable: true }}
                                    navigation={false}
                                    loop={true}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }}
                                    // onSlideChange={() =>
                                    //     //console.log('slide change')
                                    // }
                                    // onSwiper={(swiper) => console.log(swiper)}
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
                                    {nfts
                                        .filter((a) => {
                                            if (nftValidEnd(a.end_time)) {
                                                return true
                                            }
                                            return false
                                        })
                                        .sort((a, b) => {
                                            return a.end_time - b.end_time
                                        })
                                        .slice(0, 12)
                                        .map((obj, id) => {
                                            return (
                                                <SwiperSlide>
                                                    <NftInfoCard
                                                        key={id}
                                                        data={obj}
                                                        auctions={auctions}
                                                        type={'xs'}
                                                        index={99}
                                                    />
                                                </SwiperSlide>
                                            )
                                        })}
                                </Swiper>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 small-heading">
                        <h3>
                            <span className="icon">
                                <HourglassMedium size={38} color="#ff36ff" />{' '}
                                <HourglassMedium size={38} color="#20ff93" />
                            </span>{' '}
                            Almost ending
                        </h3>
                    </div>
                    <div className="col-md-12">
                        {nfts.length > 0 && (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={25}
                                slidesPerView={1}
                                loop={false}
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
                                        slidesPerView: 5,
                                    },
                                    1500: {
                                        slidesPerView: 6,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                navigation={false}
                                // onSlideChange={() =>
                                //     console.log('slide change')
                                // }
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                {nfts
                                    .filter((a) => {
                                        if (
                                            nftValid(a.end_time, a.start_time)
                                        ) {
                                            return true
                                        }
                                        return false
                                    })
                                    .sort((a, b) => {
                                        return a.end_time - b.end_time
                                    })
                                    .slice(0, 12)
                                    .map((obj, id) => {
                                        return (
                                            <SwiperSlide>
                                                <NftCard
                                                    key={id}
                                                    data={obj}
                                                    auctions={auctions}
                                                    type={'xs'}
                                                    index={99}
                                                />
                                            </SwiperSlide>
                                        )
                                    })}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 small-heading">
                        <h3>
                            <span className="icon">
                                <Clock size={38} color="#ff36ff" />{' '}
                                <Clock size={38} color="#20ff93" />
                            </span>{' '}
                            Recently ended
                        </h3>
                    </div>
                    <div className="col-md-12">
                        {nfts.length > 0 && (
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={25}
                                slidesPerView={1}
                                loop={false}
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
                                        slidesPerView: 5,
                                    },
                                    1500: {
                                        slidesPerView: 6,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                navigation={false}
                                // onSlideChange={() =>
                                //     console.log('slide change')
                                // }
                                // onSwiper={(swiper) => console.log(swiper)}
                            >
                                {nfts
                                    .filter((a) => {
                                        if (!nftValidEnd(a.end_time)) {
                                            return true
                                        }
                                        return false
                                    })
                                    .sort((a, b) => {
                                        return b.end_time - a.end_time
                                    })
                                    .slice(0, 12)
                                    .map((obj, id) => {
                                        return (
                                            <SwiperSlide
                                                style={{ opacity: 0.3 }}
                                            >
                                                <NftCard
                                                    key={id}
                                                    data={obj}
                                                    auctions={auctions}
                                                    type={'xs'}
                                                    index={99}
                                                    isEnded={true}
                                                />
                                            </SwiperSlide>
                                        )
                                    })}
                            </Swiper>
                        )}
                    </div>
                    <div className="col-md-12 heading" ref={exploreDiv}>
                        <h3>Explore by category</h3>
                    </div>
                    <div className="col-md-12 mx-auto">
                        <ul
                            className="nav nav-pills nav-pills-categories nav-justify mb-3"
                            id="pills-tab"
                            role="tablist"
                        >
                            {state.categories.map((obj, i) => {
                                return (
                                    <li
                                        className="nav-item"
                                        role="presentation"
                                    >
                                        <button
                                            className={
                                                i == 0
                                                    ? 'nav-link active'
                                                    : 'nav-link'
                                            }
                                            id={'pills-tab-' + i}
                                            data-bs-toggle="pill"
                                            data-bs-target={
                                                '#pills-content-' + i
                                            }
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-create"
                                            aria-selected="true"
                                        >
                                            {obj}
                                            <small
                                                style={{
                                                    fontSize: '12px',
                                                    opacity: 0.5,
                                                }}
                                            >
                                                (
                                                {nfts &&
                                                    obj !== 'Other' &&
                                                    obj !== 'All' &&
                                                    nfts
                                                        .filter((a) => {
                                                            if (
                                                                nftValidEnd(
                                                                    a.end_time,
                                                                )
                                                            ) {
                                                                return true
                                                            }
                                                            return false
                                                        })
                                                        .filter((a) => {
                                                            return (
                                                                a.category ==
                                                                obj
                                                            )
                                                        }).length}
                                                {nfts &&
                                                    obj === 'Other' &&
                                                    nfts
                                                        .filter((a) => {
                                                            if (
                                                                nftValidEnd(
                                                                    a.end_time,
                                                                )
                                                            ) {
                                                                return true
                                                            }
                                                            return false
                                                        })
                                                        .filter((a) => {
                                                            return (
                                                                a.category ==
                                                                null
                                                            )
                                                        }).length}
                                                {nfts &&
                                                    obj === 'All' &&
                                                    nfts
                                                        .filter((a) => {
                                                            if (
                                                                nftValidEnd(
                                                                    a.end_time,
                                                                )
                                                            ) {
                                                                return true
                                                            }
                                                            return false
                                                        })
                                                        .filter((a) => {
                                                            return a
                                                        }).length}
                                                )
                                            </small>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="tab-content" id="pills-tabContent">
                    {state.categories.map((obj, i) => {
                        return (
                            <div
                                className={
                                    i == 0
                                        ? 'tab-pane fade show active'
                                        : 'tab-pane fade'
                                }
                                id={'pills-content-' + i}
                                role="tabpanel"
                                aria-labelledby={'pills-tab-' + i}
                            >
                                <div className="row">
                                    {nfts.length > 0 &&
                                        nfts
                                            .filter((a) => {
                                                if (
                                                    obj !== 'Other' &&
                                                    obj !== 'All'
                                                ) {
                                                    return a.category == obj
                                                }
                                                if (obj === 'Other') {
                                                    return a.category == null
                                                }
                                                if (obj === 'All') {
                                                    return a
                                                }
                                            })
                                            .filter((a) => {
                                                if (nftValidEnd(a.end_time)) {
                                                    return true
                                                }
                                                return false
                                            })
                                            .map((obj, id) => {
                                                return (
                                                    <div
                                                        className={
                                                            'col-md-4 col-lg-3'
                                                        }
                                                    >
                                                        <NftCard
                                                            key={id}
                                                            data={obj}
                                                            auctions={auctions}
                                                            type={'small'}
                                                            index={99}
                                                        />
                                                    </div>
                                                )
                                            })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

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
            <MainLoader loading={loading} />
        </>
    )
}
