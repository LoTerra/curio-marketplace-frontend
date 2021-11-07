import React, { useState, useEffect } from 'react'
import { useStore } from '../store'

export default function UserModal(props) {

    const { state, dispatch } = useStore()

    return (
        <div className="modal right fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="userModalLabel">
		<div className="modal-dialog " role="document">
			<div className="modal-content">

				<div className="modal-header">
               

					<h4 className="modal-title" id="userModalLabel">Your profile</h4>
					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>

				<div className="modal-body">
					
				</div>

			</div>
		</div>
	</div>
    )
}