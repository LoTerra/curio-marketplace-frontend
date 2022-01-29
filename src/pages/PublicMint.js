import React, { useEffect } from 'react'
import { useStore } from '../store'
import {  
    useParams
  } from "react-router-dom";

export default (props) => {

    const { state, dispatch } = useStore()

    let {publicmintid} = useParams()
    const pbulicMintId = parseInt(publicmintid);


    useEffect(() => {
        //Do stuff on mount

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
