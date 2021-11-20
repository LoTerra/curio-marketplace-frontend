import React, { useState, useEffect } from 'react'

export default function Step3(props) {


    return (
        <>
        <div className="row">
        <div className="col-12">
                        <h5>Charity options</h5>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Charity address</label> <small>optional</small>
                          <input type="text" className="form-control" name="charity_address"/>
                      </div>
                      <div className="col-12 mb-3">
                          <label>Charity percentage fee</label> <small>optional</small>
                          <input type="number" className="form-control" name="charity_fee"/>
                      </div>
                      <div className="col-12 mt-3 mb-3">
                        <button type="button" type="submit" className="btn btn-primary w-100">Create</button>
                      </div>
        </div>
        </>
    )
}

