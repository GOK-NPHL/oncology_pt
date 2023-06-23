import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import DualListBox from 'react-dual-listbox';
import { FetchLots, FetchReadiness, FetchShipmentById, FetchShipments, FetchReadinessResponses, SaveLot, UpdateLot, DeleteLot, FetchParticipantList } from '../../../components/utils/Helpers';

function Lots() {

    const [allShipments, setAllShipments] = useState([])
    const [allLots, setAllLots] = useState([])
    const [allChecklists, setAllChecklists] = useState([])
    const [allParticipants, setAllParticipants] = useState([])
    const [use_checklist, setUseChecklist] = useState(null)
    const lot_temp = {
        // id: '',
        name: '',
        shipment_id: '',
        readiness_id: '',
        participants: [],
    }
    const [blankLot, setBlankLot] = useState(lot_temp)

    const fetchAllShipments = () => {
        FetchShipments('156f41ed97', 0)
            .then(data => {
                setAllShipments(data)
            })
            .catch(err => console.log(err))
    }

    const fetchAllReadinesses = () => {
        FetchReadiness()
            .then(data => {
                setAllChecklists(data)
            })
            .catch(err => console.log(err))
    }
    const fetchReadinessesParticipants = (r) => {
        if (use_checklist && r) {
            FetchReadinessResponses(r)
                .then(data => {
                    let dt = data
                    // if dt is object, convert to array
                    if (dt && typeof dt === 'object' && !Array.isArray(dt)) {
                        // dt = Object.keys(dt).map(i => dt[i])
                        dt = Object.values(dt)
                    }
                    let participants = []
                    if (dt && dt.length > 0) {
                        dt.forEach((item) => {
                            if (item.lab_id && item.lab_name) {
                                participants.push({
                                    id: item.lab_id,
                                    name: item.lab_name
                                })
                            } else {
                                console.log('no lab id or name')
                            }
                        })
                    } else {
                        console.log('no readiness responses')
                    }
                    setAllParticipants(participants)
                })
                .catch(err => console.log(err))
        } else {
            // fetch all labs
            FetchParticipantList().then(data => {
                let dt = data
                if (dt && typeof dt === 'object' && !Array.isArray(dt)) {
                    dt = Object.values(dt)
                }
                let participants = []
                if (dt && dt.length > 0) {
                    dt.forEach((item) => {
                        if (item.id && item.lab_name) {
                            participants.push({
                                id: item.id,
                                name: item.lab_name
                            })
                        } else {
                            console.log('no id or name')
                        }
                    })
                } else {
                    console.log('no labs')
                }
                setAllParticipants(participants)
            }).catch(err => console.log(err))

        }
    }

    const fetchAllLots = () => {
        FetchLots()
            .then(data => {
                setAllLots(data)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        let mtd = true

        if (mtd) {
            fetchAllShipments()
            fetchAllLots()
            fetchAllReadinesses()
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
                        <h3>Lots</h3>
                    </div>
                    <div className='col-md-7' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {/* <label className='p-0 m-0'>Filter:</label>
                            <div className='form-group m-0'>
                                <select className='form-control' onChange={() => { }}>
                                    <option value=''>All Shipments</option>
                                    {allShipments && allShipments.length > 0 && allShipments.map((shipment, index) => (
                                        <option key={shipment.id} value={shipment.id}>{shipment.round_name}</option>
                                    ))}
                                </select>
                            </div> */}
                        </div>
                        <button className='btn btn-primary float-right' data-toggle='modal' data-target='#addLotModal' id="lotModalTrigger">Add Lot</button>
                    </div>
                </header>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='table-responsive'>
                            <table className='table table-bordered table-striped table-condensed'>
                                <thead>
                                    <tr>
                                        <th>Lot Name</th>
                                        <th>Shipment</th>
                                        <th>Readiness</th>
                                        <th>Participants</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allLots && allLots.length > 0 && allLots.map((lot, index) => (
                                        <tr key={lot.id}>
                                            <td>{lot.name}</td>
                                            <td>{lot?.shipment && lot?.shipment?.code}</td>
                                            <td>{lot?.readiness && lot?.readiness?.name}</td>
                                            <td>{lot?.participantCount ?? 0}</td>
                                            <td>{new Date(lot.created_at).toLocaleString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 3, width: '100%', justifyContent: 'center' }}>
                                                    <a className='btn btn-sm btn-primary' href={`/manage-lots/${lot.id}`}>View Participants</a>
                                                    <button className='btn btn-sm btn-info' onClick={e => {
                                                        let lot2e = {
                                                            id: lot.id,
                                                            name: lot.name,
                                                            readiness_id: lot.readiness.id,
                                                            shipment_id: lot.shipment.id,
                                                            participants: Array.isArray(lot?.participants) ? lot.participants.map(p => p.id ? p.id : p) : [],
                                                            isEdit: true
                                                        }
                                                        if (lot.readiness.id) {
                                                            fetchReadinessesParticipants(lot.readiness.id)
                                                        }
                                                        setBlankLot(lot2e)
                                                        if (typeof window !== 'undefined') document.getElementById('lotModalTrigger').click()
                                                    }}>Edit Lot</button>
                                                    <button className='btn btn-sm btn-danger' onClick={e => {
                                                        if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this lot?')) {
                                                            DeleteLot(lot.id).then(res => {
                                                                if (res.status === 200) {
                                                                    fetchAllLots()
                                                                }
                                                            }).catch(err => {
                                                                console.log(err)
                                                            })
                                                        }
                                                    }}>Delete Lot</button>
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




            <div className='modal fade' id='addLotModal' tabIndex='-1' role='dialog' aria-labelledby='addLotModalLabel' aria-hidden='true'>
                <div className='modal-dialog modal-dialog-centeredz modal-lg' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='addLotModalLabel'>{blankLot?.isEdit ? "Edit " : "Add "} Lot</h5>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'> <span aria-hidden='true' onClick={e => {
                                setBlankLot(lot_temp)
                            }}>&times;</span> </button>
                        </div>
                        <div className='modal-body'>
                            <form>
                                <div className='form-group'>
                                    <label htmlFor='lotName'>Lot Name</label>
                                    <input type='text' className='form-control' value={blankLot?.name} id='lotName' placeholder='Enter Lot Name' onChange={e => setBlankLot({ ...blankLot, name: e.target.value })} />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='participant_selection'>Use checklist?</label>
                                    <div className='form-check p-0' style={{ display: 'flex', gap: 3 }}>
                                        <span><input className='form-check-inputz' type='radio' name='participant_selection' id='participant_selection1'
                                            value={true} checked={use_checklist} onChange={e => {
                                                setUseChecklist(true)
                                                setAllParticipants([])
                                            }} /> Yes</span> &nbsp;
                                        <span><input className='form-check-inputz' type='radio' name='participant_selection' id='participant_selection2'
                                            value={false} checked={use_checklist == false} onChange={e => {
                                                setUseChecklist(false)
                                                fetchReadinessesParticipants()
                                            }} /> No</span>
                                    </div>
                                </div>
                                {use_checklist && <div className='form-group'>
                                    <label htmlFor='readiness'>Readiness checklist</label>
                                    <select className='form-control' id='readiness' value={blankLot?.readiness_id} onChange={e => {
                                        let selected_checklist = allChecklists.find(checklist => checklist.id == e.target.value)
                                        let shipment_id = ''
                                        if (selected_checklist) {
                                            shipment_id = selected_checklist.shipment_id
                                        }
                                        setBlankLot({ ...blankLot, readiness_id: e.target.value, shipment_id: shipment_id })
                                        if (e.target.value) {
                                            fetchReadinessesParticipants(e.target.value)
                                        }
                                    }}>
                                        <option value={''}>Select checklist</option>
                                        {allChecklists && allChecklists.length > 0 && allChecklists.map((checklist, index) => (
                                            <option key={checklist.id} value={checklist.id}>{checklist.name}</option>
                                        ))}
                                    </select>
                                </div>}
                                <div className='form-group'>
                                    <label htmlFor='participants'>Participants:</label>
                                    <i>Total: {Array.from(allParticipants, a => a.id).filter(k => !blankLot.participants.includes(k)).length}</i> &nbsp;
                                    <i>Selected: {blankLot.participants.length}</i>
                                    <DualListBox
                                        canFilter
                                        options={Array.from(allParticipants, participant => {
                                            return { value: participant.id, label: participant.name }
                                        })}
                                        selected={blankLot.participants}
                                        onChange={e => {
                                            setBlankLot({ ...blankLot, participants: e })
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-default' data-dismiss='modal' onClick={e => {
                                setBlankLot(lot_temp)
                            }}>Cancel</button>
                            <button type='button' className='btn btn-primary' onClick={ev => {
                                if (blankLot?.isEdit) {
                                    UpdateLot(blankLot).then(res => {
                                        console.log(res)
                                        if (res.status) {
                                            setBlankLot(lot_temp)
                                            fetchLots()
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                } else {
                                    SaveLot(blankLot).then(res => {
                                        console.log(res)
                                        if (res.status) {
                                            setBlankLot(lot_temp)
                                            fetchLots()
                                        }
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                }
                            }}>Save Lot</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Lots

// Render on dom id="pt_lots"
if (document.getElementById('pt_lots')) {
    ReactDOM.render(<Lots />, document.getElementById('pt_lots'));
}
