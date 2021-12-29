import { X } from 'phosphor-react'
import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function UserModal(props) {
    const { bank, priv } = props
    const { state, dispatch } = useStore()

    return (
        <div
            className="modal right fade"
            id="userModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="userModalLabel"
        >
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="userModalLabel">
                            Your profile
                        </h4>
                        <button
                            type="button"
                            className="btn btn-secondary p-2"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <X size={24} color={'#fff'} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <h5 className="modal-heading">
                            Your balance <small>UST</small>
                        </h5>
                        <h2>{bank} UST</h2>
                        <h5 className="modal-heading">
                            Your balance <small>SITY</small>
                        </h5>
                        <h2>{parseFloat(priv / 1000000)} SITY</h2>
                        <h5 className="modal-heading mt-3">Your biddings</h5>
                        <p className="p-2 text-center text-muted">
                            Coming soon
                        </p>
                        <h5 className="modal-heading">Your nfts</h5>
                        <p className="p-2 text-center text-muted">
                            Coming soon
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
