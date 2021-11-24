import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import { Check, Clock, Info, Warning } from "phosphor-react"; 



export default function BiddingInterface(props) {
    const { state, dispatch } = useStore()

    const {
        bidInfo,
        retractBid,
        nftData,
        imageNftData,
        bidder,
        amount,
        setAmount,
        nftValid,
        connectedWallet,
        placeBid,
        buyNow
    } = props;

    function format_time(s) {
        return new Date(s * 1e3).toISOString().slice(-13, -5);
      }

    
    //console.log("data-props")
    ///console.log(data)
    return (
        <>
          <div className="col-12">
        <h5 className="mb-0">Current bids ({bidInfo.length})</h5>
                            <div style={{maxHeight:'120px',overflowY:'scroll',overflowX:'hidden'}}>
                            <table className="table bidding-table">
                                <tbody>
                                    {bidInfo.length > 0 ? bidInfo.sort(
                                        (a,b) => {return parseInt(b.amount) - parseInt(a.amount)}
                                    ).map((obj,key) => {                                    
                                        return (
                                            <tr key={key} className={key == 0 ? 'highest' : ''}>         
                                            <td>  
                                            <div className="row">
                                                <div className="col-6 text-start">
                                                <strong>{obj.amount / 1000000} UST</strong>
                                                <small className="d-block text-muted" style={{fontSize:'10px'}}>{obj.bidder.slice(0, -20) + "**********"}</small>
                                                </div>
                                                <div className="col-6 text-end">
                                                <small className="text-muted bid-time"><Clock size={'16px'} style={{position:'relative',top:'-2px', marginRight:'3px'}}/>{format_time(obj.time)}</small>
                                                </div>
                                            </div>
                                            
                                          
                                            </td>
                                            </tr>  
                                        )                                  
                                    }) 
                                    :
                                    <p className="text-muted text-center w-100 py-1 m-0">No bids yet</p>
                                    }                               
                                
                                </tbody>
                            </table>
                            </div>
                            </div>
                            
                            {nftData && nftValid(nftData.end_time,nftData.start_time) &&
                                <>
                                <div className={nftData.highest_bid != bidder.total_bid ? 'col-md-6' : 'd-none'}>
                                <h5>Your bid</h5>
                            <div className="input-group mb-0">
                                    <span className="input-group-text" id="basic-addon1">
                                        <img src="/img/UST.svg" width="30px" className="img-fluid"/>
                                    </span>
                                    <input 
                                    type="number"
                                    className="form-control amount-input-staking"
                                    required={true}
                                    disabled={nftData && nftValid(nftData.end_time,nftData.start_time) ? false : true}
                                    onChange={(e) => setAmount(e.target.value)}                                   
                                    autoComplete="off"
                                    value={amount}
                                    step="1"                                    
                                    min={nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : 0}
                                    placeholder={nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : 0}
                                    name="amount"
                                    />
                                </div>
                                </div>
                                <div className={nftData.highest_bid != bidder.total_bid ? 'col-md-6' : 'col-12'}>
                                    <div className={'nft-bidding d-flex ' + (nftData.highest_bid == bidder.total_bid ? 'success' : 'warning')}>
                                        <div className="align-self-center w-100 text-center">
                                        <h6>{nftData.highest_bid == bidder.total_bid ? 'You have the highest bid' : bidder.total_bid ? 'You have been overbid' : 'Start bidding'}</h6>
                                        <p>{nftData.highest_bid == bidder.total_bid ? <Check size={18} /> : <Info size={18} /> } {bidder.total_bid / 1000000} UST</p>
                                        {nftData.highest_bid != bidder.total_bid &&
                                        <p 
                                        style={{textDecoration:'underline', fontSize:'12px', fontWeight:300}} 
                                        onClick={() => setAmount(nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : nftData.highest_bid === null && nftData.start_price !== null ? nftData.start_price / 1000000 : 0)}>
                                            Add minimal {nftData.highest_bid ? ((parseInt(nftData.highest_bid) + (parseInt(nftData.highest_bid) * 5 / 100)) - parseInt(bidder.total_bid)) / 1000000 : nftData.highest_bid === null && nftData.start_price !== null ? nftData.start_price / 1000000 : 0} UST
                                        </p>
                                        }   
                                        </div>
                                    </div>
                                </div>
                                <small className="d-block p-3 text-muted">In order to bid you need to bid <strong>5% above</strong> current bid or min start price, each new bid is counted on top of your previous bids</small>
                                {imageNftData && !parseInt(imageNftData.private_sale) > 0  &&
                                <div className="row">
                                    <div className={nftData.highest_bid != bidder.total_bid ? nftData && nftValid(nftData.end_time,nftData.start_time) ? 'col-md-6' : 'col-md-12' : 'd-none'}>
                                    <button 
                                className="btn btn-primary btn-lg w-100"
                                disabled={nftData && nftValid(nftData.end_time,nftData.start_time) ? false : true}
                                onClick={() => placeBid()}>{nftData && nftValid(nftData.end_time,nftData.start_time) ? 'Place bid' : nftData.start_time * 1000 > Date.now() ? 'Auction not started yet' : 'Auction finished'}
                                {/* <small>{nftData && nftValid(nftData.end_time,nftData.start_time) ? getBiddingInfo(nftData) : ''}</small> */}
                                </button>
                                    </div>
                                    <div className={nftData && nftValid(nftData.end_time,nftData.start_time) && nftData.instant_buy ? 'col-md-6' : 'd-none'}>
                                    <button 
                                className="btn btn-special btn-lg w-100"
                                disabled={nftData && nftValid(nftData.end_time,nftData.start_time) && nftData.instant_buy ? false : true}
                                onClick={() => buyNow()}>{nftData && nftValid(nftData.end_time,nftData.start_time) && nftData.instant_buy ? 'Buy now' : 'Not available'}
                                <small>{nftData && nftValid(nftData.end_time,nftData.start_time) && nftData.instant_buy ? (parseInt(bidder.total_bid) > 0 ? (parseInt(nftData.instant_buy) - parseInt(bidder.total_bid)) / 1000000 : parseInt(nftData.instant_buy) / 1000000) +'UST' : ''}</small>
                                </button>
                                    </div>

                                    {nftData && nftValid(nftData.end_time,nftData.start_time) &&
                                    <div className="col-12 mt-5">
                                        <button
                                            className="btn btn-secondary btn-lg w-100"
                                            disabled={nftData && connectedWallet && nftData.highest_bidder != connectedWallet.walletAddress && parseInt(bidder.total_bid) > 0 ? false : true}
                                            onClick={() => retractBid()}>{nftData && nftValid(nftData.end_time,nftData.start_time) ? 'Retract bid(s)' : 'Retract bid not allowed'}
                                        </button>
                                    </div>
                                    }

                                </div>
}
                                </>
                                }
        </>
    )
}