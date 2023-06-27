import React from 'react';
import { FetchParticipantList, SaveShipment, FetchShipmentReadiness as FetchReadiness, FetchShipmentById, UpdateShipment, FetchLots, FetchPanels } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import { matchPath } from "react-router";
import ShipmentSample from './ShipmentSample';


class ShipmentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null,
            id: '',
            message: '',
            round: '',
            shipmentCode: '',
            startDate: '',
            resultDueDate: '',
            passMark: 100,
            testInstructions: '',
            samples: [],
            readinessId: '',
            samplesNumber: 0,
            tableRows: [], //samples elements,
            participantSource: 'checklist',
            dualListptions: [],
            readinessChecklists: [],
            selected: [],
            pageState: '',


            lots: [],
            panels: [],
            panelLots: [],
            newMapping: {
                panel_id: '',
                lot_id: '',
                panel_name: '',
                lot_name: '',
            },
            add_mapping: false,
        }

        this.handleRoundChange = this.handleRoundChange.bind(this);
        this.handleShipmentCodeChange = this.handleShipmentCodeChange.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleResultDueDateChange = this.handleResultDueDateChange.bind(this);
        this.handlePassMarkChange = this.handlePassMarkChange.bind(this);
        this.handleTestInstructionsChange = this.handleTestInstructionsChange.bind(this);
        this.addSampleRow = this.addSampleRow.bind(this);
        this.deleteSampleRow = this.deleteSampleRow.bind(this);
        this.sampleReferenceResultChange = this.sampleReferenceResultChange.bind(this);
        this.sampleNameChange = this.sampleNameChange.bind(this);
        this.handleParticipantSourceChange = this.handleParticipantSourceChange.bind(this);
        this.dualListOnChange = this.dualListOnChange.bind(this);
        this.getShipementDataById = this.getShipementDataById.bind(this);

        this.getLotsByShipment = this.getLotsByShipment.bind(this)
        this.getAllLots = this.getAllLots.bind(this)
        this.getPanelsByShipment = this.getPanelsByShipment.bind(this)
        this.getAllPanels = this.getAllPanels.bind(this)

    }

    getShipementDataById(id) {
        (async () => {

            let editData = await FetchShipmentById(id);
            if (editData.status == 500) {
                this.setState({
                    message: editData.data.Message,
                    pageState: 'edit',
                });
                $('#addPersonelModal').modal('toggle');
            } else {
                // for (let i = 0; i < editData.samples.length; i++) {
                //     this.addSampleRow(i, editData.samples[i]);
                // }
                this.setState({
                    pageState: 'edit',
                    id: id,
                    round: editData.shipment.round_name,
                    shipmentCode: editData.shipment.code,
                    startDate: editData.shipment.start_date,
                    resultDueDate: editData.shipment.end_date,
                    passMark: editData.shipment.pass_mark,
                    testInstructions: editData.shipment.test_instructions,
                    
                    ///
                    // samples: editData.samples,
                    // samplesNumber: editData.samples.length,
                    // selected: editData.labs,
                    readinessId: editData.shipment.readiness_id,
                    participantSource: editData.shipment.readiness_id == null ? 'participants' : 'checklist',
                    ///

                    panelLots: editData.panel_lots,
                });
            }
        })();
    }

    getLotsByShipment(ship_id) {
        (async () => {

            let lotsData = await FetchLots(ship_id);
            if (lotsData.status == 500) {

            } else {
                this.setState({
                    lots: lotsData,
                })
            }
        })();
    }
    getAllLots() {
        (async () => {

            let lotsData = await FetchLots();
            if (lotsData.status == 500) {

            } else {
                this.setState({
                    lots: lotsData,
                })
            }
        })();
    }
    getPanelsByShipment(ship_id) {
        (async () => {

            let panels_data = await FetchPanels(ship_id);
            if (panels_data.status == 500) {

            } else {
                this.setState({
                    panels: panels_data,
                })
            }
        })();
    }
    getAllPanels() {
        (async () => {

            let panels_data = await FetchPanels();
            if (panels_data.status == 500) {

            } else {
                this.setState({
                    panels: panels_data,
                })
            }
        })();
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {
        (async () => {
            let readinessChecklists = await FetchReadiness();
            let partsList = await FetchParticipantList();



            if (this.props.pageState == 'edit') {

                this.getShipementDataById(this.props.id);
                this.setState({
                    dualListptions: partsList,
                    readinessChecklists: readinessChecklists,
                });

                ///
                this.getPanelsByShipment(this.props.id);
                this.getLotsByShipment(this.props.id);
                ///
            } else {
                ///
                this.getAllPanels();
                this.getAllLots();
                ///

                this.setState({
                    dualListptions: partsList,
                    readinessChecklists: readinessChecklists,
                    pageState: this.props.pageState,
                    id: '',
                    message: '',
                    round: '',
                    shipmentCode: '',
                    startDate: '',
                    resultDueDate: '',
                    passMark: 100,
                    testInstructions: '',
                    samples: [],
                    readinessId: '',
                    samplesNumber: 0,
                    tableRows: [], //samples elements,
                    participantSource: 'checklist',
                    selected: [],
                });
            }

        })();
    }

    dualListOnChange(selected) {
        this.setState({ selected: selected });
    }

    handleChecklistChange(readinessId) {
        this.setState({ readinessId: readinessId });
    }

    handleParticipantSourceChange(participantSource) {

        if (participantSource == 'participants') {
            this.setState({
                participantSource: participantSource,
                readinessId: ''
            });
        } else if (participantSource == 'checklist') {
            this.setState({
                participantSource: participantSource,
                selected: []
            });
        }

    }
    handleRoundChange(round) {

        this.setState({
            round: round
        });
    }

    handleShipmentCodeChange(shipmentCode) {

        this.setState({
            shipmentCode: shipmentCode
        });
    }

    handleResultDueDateChange(resultDueDate) {
        let today = new Date();
        let rstlDate = Date.parse(resultDueDate);
        if (rstlDate < today) {
            this.setState({
                message: "Result due date cannot be less than todays date"
            });
            $('#addShipmentModal').modal('toggle');
            return;
        }

        this.setState({
            resultDueDate: resultDueDate
        });
    }

    handleStartDate(startDate) {
        let today = new Date();
        let sd = Date.parse(startDate);
        if (sd < today) {
            this.setState({
                message: "Result due date cannot be less than todays date"
            });
            $('#addShipmentModal').modal('toggle');
            return;
        }

        this.setState({
            startDate: startDate
        });
    }

    handlePassMarkChange(passMark) {

        this.setState({
            passMark: passMark
        });
    }

    handleTestInstructionsChange(testInstructions) {

        this.setState({
            testInstructions: testInstructions
        });
    }


    saveShipment() {
        if (
            this.state.passMark == '' ||
            this.state.startDate == '' ||
            this.state.resultDueDate == '' ||
            this.state.shipmentCode == '' ||
            this.state.round == '' ||
            (!this.state.panelLots || this.state.panelLots.length < 1)
        ) {
            let msg = [
                this.state.passMark == '' ? "Pass mark field is required" : '',
                this.state.startDate == '' ? "Start Date field is required" : '',
                this.state.resultDueDate == '' ? "Result Due Date field is required" : '',
                this.state.shipmentCode == '' ? "Shipement code field is required" : '',
                this.state.round == '' ? "Round Name field is required" : '',
                this.state.panelLots.length < 1 ? "No panels mapped to participant lots" : '',
            ]
            this.setState({
                message:
                    [
                        <p>Kindly fill the required fileds marked in *</p>,
                        <ul>{msg.filter(m => m && m.length > 0).map((msg, x) => <li className='text-danger' key={x}>{msg}</li>)}</ul>
                    ]
            });
            $('#addShipmentModal').modal('toggle');
        } else {

            (async () => {
                let shipement = {};
                { this.state.pageState == 'edit' ? shipement['id'] = this.state.id : '' }
                shipement['pass_mark'] = this.state.passMark;
                shipement['start_date'] = this.state.startDate;
                shipement['result_due_date'] = this.state.resultDueDate;
                shipement['shipment_code'] = this.state.shipmentCode;
                shipement['round'] = this.state.round;
                shipement['panel_lots'] = this.state.panelLots;
                shipement['test_instructions'] = this.state.testInstructions;

                if (this.state.pageState == 'edit') {
                    let response = await UpdateShipment(shipement);
                    this.setState({
                        message: response.data.Message,
                    });
                } else {
                    let response = await SaveShipment(shipement);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            passMark: 80,
                            startDate: '',
                            resultDueDate: '',
                            shipmentCode: '',
                            round: '',
                            samples: [],
                            tableRows: [],
                            samplesNumber: 0,
                            selected: [],
                            readinessId: '',
                            testInstructions: '',

                            panelLots: [],
                            newMapping: {
                                panel_id: '',
                                lot_id: '',
                                panel_name: '',
                                lot_name: '',
                            },
                            add_mapping: false,
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }
                }
                $('#addShipmentModal').modal('toggle');
            })();
        }
    }


    deleteSampleRow(index) {

        let tableRows = this.state.tableRows;
        let samples = this.state.samples;
        delete samples[index];
        delete tableRows[index];
        this.setState({
            tableRows: tableRows,
            samples: samples,
            samplesNumber: this.state.samplesNumber - 1
        })
    }

    sampleReferenceResultChange(index, refResultId, refResultValue) {
        let samples = this.state.samples;
        let sample = samples[index];
        sample[refResultId] = refResultValue;
        samples[index] = sample;
        this.setState({
            samples: samples
        })
    }

    sampleNameChange(index, name) {
        let samples = this.state.samples;
        let sample = samples[index];
        sample['name'] = name;
        samples[index] = sample;
        this.setState({
            samples: samples
        })
    }

    addSampleRow(index, val) {
        let tableRows = this.state.tableRows;

        let samples = this.state.samples;
        let sampleDefaults = { '16': null, '18': null, 'other': null, 'name': '' };
        let newSample = sampleDefaults;

        tableRows.push(<ShipmentSample
            key={uuidv4()}
            index={index}
            deleteSampleRow={this.deleteSampleRow}
            result={val ? val : sampleDefaults}
            name={val ? val.name : ''}
            sampleReferenceResultChange={this.sampleReferenceResultChange}
            sampleNameChange={this.sampleNameChange}
        />);

        samples.push(newSample);

        this.setState({
            tableRows: tableRows,
            samples: samples,
            samplesNumber: this.state.samplesNumber + 1
        });

    }


    render() {
        let dualListValues = [];


        if (this.state.dualListptions.length != 0) {
            dualListValues = this.state.dualListptions.map((participant) => {
                let pat = {};
                pat['value'] = participant.id;
                pat['label'] = participant.lab_name;
                return pat;
            })
        }

        let checklists = [];
        this.state.readinessChecklists.map((checklist) => {
            checklists.push(<option key={checklist.id} value={checklist.id}>{checklist.name}</option>);
        });

        let labSelect = <div>No checklist defined</div>;
        if (this.state.readinessChecklists.length != 0) {
            labSelect = <select
                id="u_readinessId"
                value={this.state.readinessId}
                onChange={(event) => this.handleChecklistChange(event.target.value)} type="text"
                data-dropup-auto="false"
                data-live-search="true"
                // className="selectpicker form-control dropup">
                className="form-control"
            >
                <option >Select checklist...</option>
                {checklists}
            </select>;
        }

        let participantList = <div key={uuidv4()} className="mt-3"
            style={{
                "display": this.state.participantSource == 'participants' ? '' : "none",
                "width": "80%"
            }} >
            <p style={{ "fontWeight": "700" }}>Choose participants:</p>
            <DualListBox
                canFilter
                options={dualListValues}
                selected={this.state.selected}
                onChange={this.dualListOnChange}
            />
        </div>

        let checklistParticipant = <div key={uuidv4()} className="mt-3"
            style={{
                "display": this.state.participantSource == 'checklist' ? '' : "none",
                "width": "50%"
            }}>
            <label htmlFor="u_readinessId" >Select Checklist *</label>
            {labSelect}
        </div>

        let participants = [participantList, checklistParticipant];
        if (this.state.pageState == 'edit') {
            if (this.state.participantSource == 'participants') {
                participants = [participantList];
            } else if (this.state.participantSource == 'checklist') {
                participants = [checklistParticipant];
            }
        }
        //  pageState: 'edit', participantSource: editData.shipment.readiness_id == null ? 'participants' : 'checklist'

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">

                        <div className="form-row">

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_round" >Round Name *</label>
                                <input
                                    value={this.state.round}
                                    onChange={(event) => this.handleRoundChange(event.target.value)} type="text"
                                    className="form-control" id="u_round" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_shipment_code" >Shipment Code *</label>
                                <input
                                    value={this.state.shipmentCode}
                                    onChange={(event) => this.handleShipmentCodeChange(event.target.value)} type="text"
                                    className="form-control" id="u_shipment_code" />
                            </div>

                        </div>


                        <div className="form-row">
                            {/* add */}
                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_start_date" >Start Date  *</label>
                                <input
                                    value={this.state.startDate}
                                    onChange={(event) => this.handleStartDate(event.target.value)}
                                    type="date" className="form-control" id="u_start_date" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_result_due_date" >Result Due Date  *</label>
                                <input
                                    value={this.state.resultDueDate}
                                    onChange={(event) => this.handleResultDueDateChange(event.target.value)}
                                    type="date" className="form-control" id="u_result_due_date" />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="u_pass_mark" >Pass mark (%)*</label>
                                <input
                                    min={0}
                                    max={100}
                                    value={this.state.passMark}
                                    onChange={(event) => this.handlePassMarkChange(event.target.value)}
                                    type="number" className="form-control" id="u_pass_mark" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-sm-12 mb-3">
                                <label htmlFor="test_instructions" >Testing Instructions</label>
                                <textarea
                                    value={this.state.testInstructions}
                                    onChange={(event) => this.handleTestInstructionsChange(event.target.value)}
                                    className="form-control" id="test_instructions" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-sm-12 mb-3">
                                <div className="row">
                                    <div className="col-md-12" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label>Panel - Participant Mapping Matrix</label>
                                        <button className='btn btn-primary btn-sm' onClick={e => {
                                            e.preventDefault();
                                            this.setState({ add_mapping: true })
                                        }}><b>+ Add mapping</b></button>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Panel</th>
                                                <th scope="col">Lot</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.panelLots.map((panelLot, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{panelLot?.panel_name}</td>
                                                        <td>{panelLot?.lot_name}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => {
                                                                    let panelLots = this.state.panelLots;
                                                                    panelLots.splice(index, 1);
                                                                    this.setState({ panelLots: panelLots })
                                                                }}
                                                                className="btn btn-danger btn-sm">
                                                                &times;
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            {this.state.add_mapping && (
                                                <tr>
                                                    <td>
                                                        <select className='form-control' onChange={e => {
                                                            let selected_panel = this.state.panels.find(panel => panel.id == e.target.value)
                                                            if (selected_panel) {
                                                                this.setState({
                                                                    newMapping: {
                                                                        ...this.state.newMapping,
                                                                        panel_name: selected_panel?.name,
                                                                        panel_id: selected_panel?.id
                                                                    }
                                                                })
                                                            }
                                                        }}>
                                                            <option> - Select Panel - </option>
                                                            {this.state.panels.map(panel => (
                                                                <option key={panel?.id} value={panel?.id}>{panel?.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <select className='form-control' onChange={e => {
                                                            let selected_lot = this.state.lots.find(lot => lot.id == e.target.value)
                                                            if (selected_lot) {
                                                                this.setState({
                                                                    newMapping: {
                                                                        ...this.state.newMapping,
                                                                        lot_name: selected_lot?.name,
                                                                        lot_id: selected_lot?.id
                                                                    }
                                                                })
                                                            }
                                                        }}>
                                                            <option> - Select Lot </option>
                                                            {this.state.lots.map(lot => (
                                                                <option key={lot?.id} value={lot?.id}>{lot?.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                // create unique id
                                                                if (this.state.newMapping?.panel_name && this.state.newMapping?.lot_name && this.state.newMapping?.panel_id && this.state.newMapping?.lot_id) {
                                                                    let mapping_id = 'p_' + this.state.newMapping?.panel_id + '_l_' + this.state.newMapping?.lot_id
                                                                    if (Array.from(this.state.panelLots, pl => 'p_' + pl?.panel_id + '_l_' + pl?.lot_id).includes(mapping_id)) {
                                                                        alert('This mapping already exists')
                                                                        return
                                                                    }
                                                                    if (Array.from(this.state.panelLots, pl => pl?.lot_id).includes(this.state.newMapping?.lot_id)) {
                                                                        alert('This lot is already mapped to another panel')
                                                                        return
                                                                    }
                                                                    this.setState({
                                                                        add_mapping: false,
                                                                        panelLots: [...this.state.panelLots, this.state.newMapping],
                                                                        newMapping: {
                                                                            panel_name: '',
                                                                            lot_name: '',
                                                                            panel_id: '',
                                                                            lot_id: ''
                                                                        }
                                                                    })
                                                                } else {
                                                                    alert('Please select a panel and a lot')
                                                                }

                                                            }}
                                                            className="btn btn-success btn-sm">
                                                            +
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* choose participant source */}
                        {/* <div className="form-row bg-white mb-3 pt-2 rounded">
                            <div className="col-sm-12 mb-3  ml-2">


                                {this.state.pageState != 'edit' ?
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input"
                                            checked={this.state.participantSource == 'checklist'}
                                            type="radio" value="checklist" onChange={() => this.handleParticipantSourceChange('checklist')}
                                            name="attach_participants" id="checklist" />
                                        <label className="form-check-label" htmlFor="checklist" >
                                            Attach Checklist Sent to Laboratories
                                        </label>
                                    </div>
                                    : ''}

                                {this.state.pageState != 'edit' ?
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio"
                                            checked={this.state.participantSource == 'participants'}
                                            value="participants" onChange={() => this.handleParticipantSourceChange('participants')}
                                            name="attach_participants" id="participants" />
                                        <label className="form-check-label" htmlFor="participants" >
                                            Select Laboratories
                                        </label>
                                    </div>
                                    : ''}

                                {participants}

                            </div>
                        </div> */}
                        {/* End choose participant source */}




                        {/* <div className="form-row mt-2 bg-white rounded">
                            <div className="col-sm-12  ml-2">

                                <h5>Sample log</h5>
                                <hr />
                            </div>

                        </div>

                        <div className="form-row bg-white">

                            <div className="col-sm-12">
                                <table className="table unstrip table-bordered table-sm ">
                                    <tbody>
                                        <tr>
                                            <td rowSpan="2">
                                                <strong>Sample *</strong>
                                            </td>
                                            <td colSpan="3">
                                                <strong>Reference result * </strong>
                                            </td>
                                            <td rowSpan="2">
                                                <strong>Action</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>HR HPV 16</strong></td>
                                            <td><strong>HR HPV 18-45</strong></td>
                                            <td><strong>Others HR HPV</strong></td>
                                        </tr>

                                        {this.state.tableRows.map((row) => {
                                            if (row != undefined)
                                                return row;
                                        })}
                                        <tr>
                                            <td>
                                                <a onClick={() => {
                                                    this.addSampleRow(this.state.tableRows.length)
                                                }}>
                                                    <ReactTooltip />
                                                    <i data-tip="Add sample" style={{ "color": "blue" }} className="fas fa-plus-circle fa-2x"></i>
                                                </a>
                                            </td>
                                            <td colSpan="3"></td>
                                            <td></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                        </div> */}

                        <div className="form-group row mt-4">
                            <div className="col-sm-12 text-center">
                                <a href="#" onClick={() => this.saveShipment()} type="" className="d-inline m-2 btn btn-info m">

                                    {this.props.pageState == 'edit' ? "Update Shipment" : "Ship Round"}

                                </a>
                                <a
                                    onClick={() => {
                                        this.props.toggleView('list');
                                    }

                                    }
                                    className="d-inline m-2 btn btn-danger">Exit</a>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="modal fade" id="addShipmentModal" tabIndex="-1" role="dialog" aria-labelledby="addShipmentModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addShipmentModalTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.message ? (
                                        // if message is an array
                                        Array.isArray(this.state.message) ? (
                                            this.state.message.map((m, x) => <React.Fragment key={x}>{m}</React.Fragment>)
                                        ) : (
                                            // else just display it
                                            this.state.message
                                        )
                                    ) : ''
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div >
            </React.Fragment>
        );
    }

}

export default ShipmentForm;