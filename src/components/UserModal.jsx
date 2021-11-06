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
					<p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
					</p>
				</div>

			</div>
		</div>
	</div>
    )
}