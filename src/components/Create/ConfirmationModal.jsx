import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Card from '../SingleNft/Card';

export default function ConfirmationModal(props) {
    const {confirm,toggleConfirm,finalCreation, formData,nftImage} = props;
    const { state, dispatch } = useStore()

   useEffect(() => {
        if(confirm){
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }
   },[confirm])

    return (
        <div className={'confirm-background d-flex' + (!confirm ? '' : ' show')}>
            <div className="confirm-dialog align-self-center">
                <div className="row">
                    <div className="col-md-4 mt-4">                        
                        <Card
                                key={1}
                                data={state.auctions}
                                nft={{image: nftImage}}
                                type={'xl'}
                                expiryTimestamp={0}
                                index={99}
                            />
                    </div>
                    <div className="col-md-8">
                        <h1 className="mb-0 mt-4">Almost ready!</h1>
                        <h2 className="mb-4">Confirm auction settings</h2>                        
                        { formData &&
                            <div className="form-group">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="nft-stats">
                                <h6>Scheduled to start</h6>
                                <p className="highest_bid">{formData.start_time ? formData.start_time : 'None'}</p>
                                </div>
                                </div>
                                
                                <div className="col-md-6">
                                <div className="nft-stats">
                                <h6>Auction end</h6>
                                <p className="highest_bid">{formData.end_time ? formData.end_time : 'None'}</p>
                                </div>
                                </div>        
                                <div className="col-md-6">
                                <div className="nft-stats">
                                <h6>Opening bid price (UST)</h6>
                                <p className="highest_bid">{formData.start_price ? formData.start_price+'UST' : 'None'}</p>
                                </div>
                                </div>        
                                <div className="col-md-6">
                                <div className="nft-stats">
                                <h6>Buyout price (UST)</h6>
                                <p className="highest_bid">{formData.instant_buy ? formData.instant_buy+'UST' : 'None'}</p>
                                </div>
                                </div>        
                                <div className="col-md-6">
                                <div className="nft-stats">
                                <h6>Reserve price (UST)</h6>
                                <p className="highest_bid">{formData.reserve_price ? formData.reserve_price+'UST' : 'None'}</p>
                                </div>
                                </div>        
                                <div className="col-md-6">
                                <div className="nft-stats">
                                <h6>Private auction</h6>
                                <p className="highest_bid">{formData.private_sale ? 'Yes' : 'No'}</p>
                                </div>
                                </div>        
                            <div className="col-md-6">
                            <div className="nft-stats">
                            <h6>Charity address</h6>
                            <p className="highest_bid">{formData.charity_address ? formData.charity_address : 'None'}</p>
                            </div>
                            </div>        
                            <div className="col-md-6">
                            <div className="nft-stats">
                            <h6>Charity percentage fee</h6>
                            <p className="highest_bid">{formData.charity_fee ? formData.charity_fee+'%' : 'None'}</p>
                            </div>     
                            </div>                   
                            </div>
                        </div>
                        }
                    </div>
                    <div className="col-md-12 mt-5">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <button type="button" className="btn btn-secondary btn-lg w-100" onClick={() => toggleConfirm()}>Reject</button>
                            </div>
                            <div className="col-md-6 mb-3">
                                <button type="button" className="btn btn-primary btn-lg w-100" onClick={() => finalCreation()}>Confirmed, create auction</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}
