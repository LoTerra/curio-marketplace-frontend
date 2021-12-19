import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'

export default function ConfirmationModal(props) {
    const {confirm,finalCreation,toggle} = props;
    const { state, dispatch } = useStore()

    return (
        <div className={'confirm-background' + (confirm ? ' show' : '')} onClick={() => toggle()}>
            <div className="confirm-dialog">
                <div className="row">
                    <div className="col-md-4">
                        
                    </div>
                    <div className="col-md-8">
                        <h2>Confirm setting</h2>
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6">
                                <label>Scheduled to start</label>
                            <p>0</p>
                                </div>
                                <div className="col-md-6">
                                <label>Auction end</label>
                            <p>0</p>
                                </div>
                                <div className="col-md-6">
                                <label>Opening bid price</label>
                            <p>0</p>
                                </div>
                                <div className="col-md-6">
                                <label>Buyout price</label>
                            <p>0</p>
                                </div>
                                <div className="col-md-6">
                                <label>Reserve price</label>
                            <p>0</p>
                                </div>
                                <div className="col-md-6">
                                <label>Private sale amount in SITY</label>
                            <p>0</p>
                                </div>
                            <div className="col-md-6">
                            <label>Charity address</label>
                            <p>0</p>
                            </div>
                            <div className="col-md-6">
                            <label>Charity percentage fee</label>
                            <p>0</p>
                            </div>                
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-6">
                                <button>Reject</button>
                            </div>
                            <div className="col-md-6">
                                <button>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}
