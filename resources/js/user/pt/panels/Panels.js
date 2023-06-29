import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { FetchPanels, FetchReadiness, FetchShipmentById, FetchShipments, FetchReadinessResponses, SavePanel, UpdatePanel, DeletePanel, FetchParticipantList } from '../../../components/utils/Helpers';

function Panels() {

    const [allPanels, setAllPanels] = useState([])
    const [allParticipants, setAllParticipants] = useState([])
    const [use_checklist, setUseChecklist] = useState(null)
    const [show_sample_input_row, setShowSampleInputRow] = useState(false)
    const panel_temp = {
        // id: '',
        name: '',
        samples: [],
    }
    const sample_temp = {
        // id: '',
        'name': '',
        'hpv_16': '',
        'hpv_18': '',
        'hpv_other': '',
    }
    const result_options = [
        'Positive',
        'Negative',
        'Invalid',
    ]
    const [blankPanel, setBlankPanel] = useState(panel_temp)
    const [blankSample, setBlankSample] = useState(sample_temp)

    const fetchAllPanels = () => {
        FetchPanels().then(data => {
            setAllPanels(data)
        }).catch(err => console.log(err))
    }


    useEffect(() => {
        let mtd = true
        if (mtd) {
            fetchAllPanels()
        }
        return () => {
            mtd = false
        }
    }, [])
    return (
        <>
            <div className='container'>
                <header className='row mb-3'>
                    <div className='col-md-5'>
                        <h3>Panels</h3>
                    </div>
                    <div className='col-md-7' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {/* <label className='p-0 m-0'>Filter by round:</label> */}
                        </div>
                        <button className='btn btn-primary float-right' data-toggle='modal' data-target='#addPanelModal' id="panelModalTrigger">Add Panel</button>
                    </div>
                </header>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-condensed'>
                                <thead>
                                    <tr>
                                        <th>Panel Name</th>
                                        <th>Samples</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPanels && allPanels.length > 0 && allPanels.map((panel, index) => (
                                        <tr key={panel.id}>
                                            <td>{panel?.name}</td>
                                            <td>{panel?.sample_count ?? 0}</td>
                                            <td>{panel.created_at ? new Date(panel.created_at).toLocaleString() : '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center' }}>
                                                    <a className='btn btn-sm btn-primary' href={`/manage-panels/${panel.id}`}>View</a>
                                                    <button className='btn btn-sm btn-info' onClick={e => {
                                                        let panel2e = {
                                                            id: panel.id,
                                                            name: panel.name,
                                                            // shipment_id: panel.shipment.id,
                                                            samples: Array.isArray(panel?.samples) ? panel.samples : [],
                                                            mode: 'edit'
                                                        }
                                                        setBlankPanel(panel2e)
                                                        if (typeof window !== 'undefined') document.getElementById('panelModalTrigger').click()
                                                    }}>Edit Panel</button>
                                                    <button className='btn btn-sm btn-danger' onClick={e => {
                                                        if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this panel?')) {
                                                            if (panel.id) {
                                                                DeletePanel(panel.id).then(res => {
                                                                    if (res.status === 200) {
                                                                        fetchAllPanels()
                                                                    }
                                                                }).catch(err => {
                                                                    console.log(err)
                                                                })
                                                            } else {
                                                                let new_panels = allPanels.splice(index, 1)
                                                                setAllPanels(new_panels)
                                                            }
                                                        }
                                                    }}>Delete Panel</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>




            <div className='modal fade' id='addPanelModal' tabIndex='-1' role='dialog' aria-labelledby='addPanelModalLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centeredz modal-xl' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='addPanelModalLabel'>{blankPanel?.mode == 'edit' ? "Edit " : "Add "} Panel</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'> <span aria-hidden='true' onClick={e => {
                                setBlankPanel(panel_temp)
                            }}>&times;</span> </button>
                        </div>
                        <div className='modal-body'>
                            <form>
                                <div className='form-group'>
                                    <label htmlFor='panelName'>Panel Name</label>
                                    <input type='text' className='form-control' value={blankPanel?.name} id='panelName' placeholder='Enter Panel Name' onChange={e => setBlankPanel({ ...blankPanel, name: e.target.value })} />
                                </div>
                                <div className='form-group'>
                                    <div className=''>
                                        <label htmlFor='samples'>Samples</label>
                                        <button type='button' className='btn btn-link btn-sm' onClick={e => {
                                            // add new row to samples table
                                            setShowSampleInputRow(true)
                                        }}><u>+ Add sample</u></button>
                                    </div>
                                    <div className='row' >
                                        <div className='col-md-12 p-o'>
                                            <div className='table-responsive'>
                                                <table className='table table-bordered table-condensed'>
                                                    <thead>
                                                        <tr>
                                                            <th className='p-0' rowSpan={2}>Sample Name</th>
                                                            <th className='p-0' rowSpan={1} colSpan={3}>Reference Results</th>
                                                            <th className='p-0' rowSpan={2}>Action</th>
                                                        </tr>
                                                        <tr>
                                                            <th className='p-0'>HR HPV 16</th>
                                                            <th className='p-0'>HR HPV 18-45</th>
                                                            <th className='p-0'>Others HR HPV</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {blankPanel?.samples && blankPanel?.samples.length > 0 && blankPanel?.samples.filter(
                                                            s => (
                                                                !s?.deleted || (s?.deleted && (s?.deleted != true))
                                                            )
                                                        ).map((sample, index) => (
                                                            <tr key={index}>
                                                                <td>{sample?.name} {sample?.deleted ? '-': ''}</td>
                                                                <td className='text-uppercase'>{sample?.hpv_16}</td>
                                                                <td className='text-uppercase'>{sample?.hpv_18}</td>
                                                                <td className='text-uppercase'>{sample?.hpv_other}</td>
                                                                <td>
                                                                    <button type='button' className='btn btn-danger btn-sm' onClick={e => {
                                                                        if (typeof window != undefined && window.confirm(
                                                                            'Are you sure you want to delete this sample?'
                                                                        )) {
                                                                            // if sample has 'id', add a 'deleted' attribute. else, remove it from the blankpanel.samples array.
                                                                            let updated_samples = blankPanel?.samples
                                                                            if (sample?.id && blankPanel?.mode == 'edit') {
                                                                                sample.deleted = true;
                                                                                updated_samples[index] = sample
                                                                            } else {
                                                                                updated_samples.splice(index, 1)
                                                                            }
                                                                            setBlankPanel({ ...blankPanel, samples: updated_samples })
                                                                        }
                                                                    }}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(show_sample_input_row && show_sample_input_row === true) ? <tr style={{ backgroundColor: 'wheat' }}>
                                                            <td>
                                                                <input className='form-control' type="text" value={blankSample?.name} onChange={e => {
                                                                    setBlankSample({ ...blankSample, name: e.target.value })
                                                                }} />
                                                            </td>
                                                            <td>
                                                                <select className='form-control' value={blankSample?.hpv_16} onChange={e => {
                                                                    setBlankSample({ ...blankSample, hpv_16: e.target.value })
                                                                }}>
                                                                    <option value={''}> - </option>
                                                                    {result_options.map(option => <option key={option} value={option}>{option}</option>)}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select className='form-control' value={blankSample?.hpv_18} onChange={e => {
                                                                    setBlankSample({ ...blankSample, hpv_18: e.target.value })
                                                                }}>
                                                                    <option value={''}> - </option>
                                                                    {result_options.map(option => <option key={option} value={option}>{option}</option>)}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select className='form-control' value={blankSample?.hpv_other} onChange={e => {
                                                                    setBlankSample({ ...blankSample, hpv_other: e.target.value })
                                                                }}>
                                                                    <option value={''}> - </option>
                                                                    {result_options.map(option => <option key={option} value={option}>{option}</option>)}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <button type='button' className='btn btn-success btn-sm py-0' onClick={e => {
                                                                    setBlankPanel({
                                                                        ...blankPanel,
                                                                        samples: [
                                                                            ...blankPanel.samples,
                                                                            blankSample
                                                                        ]
                                                                    })
                                                                    setBlankSample(sample_temp)
                                                                    setShowSampleInputRow(false)
                                                                }}>Add sample</button>
                                                            </td>
                                                        </tr> : <tr>
                                                            <td colSpan={5} className='py-1'>
                                                                <button type='button' className='btn btn-link py-0' onClick={e => { setShowSampleInputRow(true) }}>+ Add sample</button>
                                                            </td>
                                                        </tr>}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-default' data-dismiss='modal' onClick={e => {
                                setBlankPanel(panel_temp)
                            }}>Cancel</button>
                            <button type='button' className='btn btn-primary' onClick={ev => {
                                if (blankPanel?.mode === 'edit') {
                                    UpdatePanel(blankPanel).then(res => {
                                        console.log(res)
                                        if (res.status) {
                                            setBlankPanel(panel_temp)
                                            fetchAllPanels()
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                } else {
                                    SavePanel(blankPanel).then(res => {
                                        console.log(res)
                                        if (res.status) {
                                            setBlankPanel(panel_temp)
                                            fetchAllPanels()
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                }
                            }}>Save Panel</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Panels

// Render on dom id="pt_panels"
if (document.getElementById('pt_panels')) {
    ReactDOM.render(<Panels />, document.getElementById('pt_panels'));
}
