import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { FetchPanel, FetchReadiness, FetchShipmentById, FetchShipments, FetchReadinessResponses, SavePanel, exportToExcel } from '../../../components/utils/Helpers';
import { type } from 'jquery';

function PanelDetail() {

    const [panel, setPanel] = useState([])


    const fetchPanelDetails = (lid) => {
        FetchPanel(lid)
            .then(data => {
                setPanel(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        let mtd = true

        if (mtd) {
            // get router params
            if (typeof window !== 'undefined') {
                let panel_id = window.location.pathname.split('/').pop()
                if (panel_id) {
                    fetchPanelDetails(panel_id)
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
                        <a href='/manage-panels' className='btn btn-default btn-sm'>&larr; Go back</a>
                    </div>
                    <div className='col-md-9'>
                        <h3>{panel?.name || "Panel details"}</h3>
                    </div>
                    <div className='col-md-2 pull-right'>
                    </div>
                </header>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <h3>Panel samples</h3>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-condensed'>
                                <thead>
                                    <tr>
                                        <th rowSpan={2}>Sample Name</th>
                                        <th colSpan={3}>Reference results</th>
                                    </tr>
                                    <tr>
                                        <th>HPV 16</th>
                                        <th>HPV 18/45</th>
                                        <th>HPV Other</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {panel?.samples?.map((sample, index) => (
                                        <tr key={index}>
                                            <td>{sample?.name}</td>
                                            <td>{sample?.hpv_16}</td>
                                            <td>{sample?.hpv_18}</td>
                                            <td>{sample?.hpv_other}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <br/>
                <div className='row'>
                    <div className='col-md-12'>
                        <h3>Lots assigned this panel</h3>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-condensed'>
                                <thead>
                                    <tr>
                                        <th>Lot Name</th>
                                        <th>Participant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {panel?.lots && panel?.lots.length>0 ? (panel?.lots.map((lot, index) => (
                                        <tr key={index}>
                                            <td>{lot?.name}</td>
                                            <td>{panel?.name}</td>
                                        </tr>
                                    ))) : <tr><td colSpan={4}>No lots assigned</td></tr> }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PanelDetail

// Render on dom id="pt_panel_details"
if (document.getElementById('pt_panel_details')) {
    ReactDOM.render(<PanelDetail />, document.getElementById('pt_panel_details'));
}
