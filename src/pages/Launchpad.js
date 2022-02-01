import { Rocket } from 'phosphor-react'
import React, { useEffect } from 'react'
import { useStore } from '../store'

export default (props) => {

    const { state, dispatch } = useStore()

    useEffect(() => {
        //Do stuff on mount

    },[])

    return (
        <>
            <section className="nfts-big d-flex" style={{ minHeight: '100vh' }}>
            <div className="container align-self-center w-100">
                <div className="row mt-4">
                    <div className="col-lg-8 mx-auto text-center py-4">
                        <Rocket size={'45'} className="d-block mx-auto"/>
                        <h1>Launchpad</h1>
                        <p className="text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tellus turpis, pellentesque eget nunc non, vestibulum malesuada odio. Aenean mattis sodales commodo. Vestibulum malesuada egestas bibendum. </p>
                        <button className="btn btn-primary btn-lg">Join launchpad</button>
                    </div>                   
                    <div className="col-12 mt-5">
                        <h4>Active mints</h4>
                        <div className="row">
                            { [1,2,3,4].map(a => {
                                return (
                                    <div className="col-lg-3">
                                <div className="card text-white nft-card ratio ratio-1x1">
                                <div className="card-img-overlay">
                                    <div className="d-flex h-100 w-100">
                                        <div className="nft-info align-self-end w-100">
                                            <h5 className="card-title m-0">Project title</h5>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <h4>Upcoming projects</h4>
                        <div className="row">
                            { [1,2,3,4].map(a => {
                                return (
                                    <div className="col-lg-3">
                                <div className="card text-white nft-card ratio ratio-1x1">
                                <div className="card-img-overlay">
                                    <div className="d-flex h-100 w-100">
                                        <div className="nft-info align-self-end w-100">
                                            <h5 className="card-title m-0">Project title</h5>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </>
    )
}
