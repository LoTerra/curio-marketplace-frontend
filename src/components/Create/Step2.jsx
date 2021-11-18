import React, { useState, useEffect } from 'react'

export default function Step2(props) {


    return (
        <>
        <div className="row">
        <div className="col-12">
                        <h5>Auction settings</h5>
                      </div>
                      <div className="col-6 mb-3">
                          <label>Time end</label>
                          <input type="datetime-local" className="form-control" name="end_time" required/>
                      </div>
                      <div className="col-6 mb-3">
                          <label>Time start</label> <small>optional</small>
                          <input type="datetime-local" className="form-control" name="start_time"/>
                      </div>
                      <div className="col-6 mb-3">
                          <label>Start/Minimal price</label> <small>optional</small>
                          <input type="number" className="form-control" name="start_price"/>
                      </div>   
                      <div className="col-6 mb-3">
                          <label>Instant buy price</label> <small>optional</small>
                          <input type="number" className="form-control" name="instant_buy"/>
                      </div>
                      <div className="col-6 mb-3">
                          <label>Reserve price</label> <small>optional</small>
                          <input type="number" className="form-control" name="reserve_price"/>
                      </div>
                      <div className="col-6 mb-3">
                          <label>Private sale amount</label> <small>optional</small>
                          <input type="number" className="form-control" name="private_sale_privilege"/>
                      </div>
        </div>
        </>
    )
}

