import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { FetchLot, FetchReadiness, FetchShipmentById, FetchShipments, FetchReadinessResponses, SaveLot, exportToExcel } from '../../../components/utils/Helpers';
import { type } from 'jquery';

function LotDetail() {

    const [lot, setLot] = useState([])


    const fetchLotDetails = (lid) => {
        FetchLot(lid)
            .then(data => {
                setLot(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        let mtd = true

        if (mtd) {
            // get router params
            if (typeof window !== 'undefined') {
                let lot_id = window.location.pathname.split('/').pop()
                if (lot_id) {
                    fetchLotDetails(lot_id)
                }
            }
        }
        return () => {
            mtd = false
        }
    }, [])
    return (
        <>
            <div className='container'>
                <header className='row mb-3'>
                    <div className='col-md-1'>
                        {/* go back */}
                        <a href='/manage-lots' className='btn btn-default btn-sm'>&larr; Go back</a>
                    </div>
                    <div className='col-md-9'>
                        <h3>{lot?.name || "Lot details"}</h3>
                    </div>
                    <div className='col-md-2 pull-right'>
                        <button type="button" className="btn btn-success btn-sm mx-1" onClick={() => {
                            if (lot && lot?.participants && lot?.participants.length > 0) {
                                let final_data = lot?.participants.map(element => {
                                    return {
                                        'participant name': element.lab_name,
                                        'MFL code': element.mfl_code,
                                        'participant code': element.pt_code,
                                        'county': element.county_name,
                                        'round': lot.shipment.code,
                                        'checklist': lot.readiness.name,
                                    }
                                })
                                exportToExcel(final_data, (lot?.name||"")+" Participants");
                            } else {
                                console.error('No data to export');
                                alert('No data to export')
                            }
                        }}>
                            <i className='fa fa-download'></i>&nbsp;
                            Excel/CSV
                        </button>
                    </div>
                </header>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <h3>Participants</h3>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-condensed'>
                                <thead>
                                    <tr>
                                        <th>Participant Name</th>
                                        <th>Participant PT Code</th>
                                        <th>County</th>
                                        <th>Shipment / Round</th>
                                        <th>Readiness Checklist</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lot?.participants?.map((participant, index) => (
                                        <tr key={index}>
                                            <td>{participant?.lab_name}</td>
                                            <td>{participant?.pt_code}</td>
                                            <td>{participant?.county_name}</td>
                                            <td>{lot?.shipment?.code}</td>
                                            <td>{lot?.readiness?.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LotDetail

// Render on dom id="pt_lot_details"
if (document.getElementById('pt_lot_details')) {
    ReactDOM.render(<LotDetail />, document.getElementById('pt_lot_details'));
}
