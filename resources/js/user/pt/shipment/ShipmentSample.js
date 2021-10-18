import React from 'react';
import { FetchParticipantList, SaveShipment, FetchReadiness, FetchShipmentById } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';
import './PtShipment.css';

import ReactTooltip from 'react-tooltip';
import { matchPath } from "react-router";


class ShipmentSample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            index: '',
            result: ''
        }
        this.sampleReferenceResultChange = this.sampleReferenceResultChange.bind(this);
        this.sampleNameChange = this.sampleNameChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            name: this.props.name,
            index: this.props.index,
            result: this.props.result,
        })
    }

    sampleReferenceResultChange(index, refResultId, refResultValue) {
        let referenceResult = this.state.result


        referenceResult[refResultId] = refResultValue;
        this.setState({
            result: referenceResult
        })
        this.props.sampleReferenceResultChange(index, refResultId, refResultValue);
    }

    sampleNameChange(index, name) {

        this.setState({
            name: name
        })
        this.props.sampleNameChange(index, name);
    }

    render() {

        let defaultHPV16 = '';
        let defaultHPV18 = '';
        let defaultHPVOther = '';

        if (this.state.result['16'] == 'Positive') {
            defaultHPV16 = 'Positive'
        } else if (this.state.result['16'] == 'Negative') {
            defaultHPV16 = 'Negative'
        } else if (this.state.result['16'] == 'Invalid') {
            defaultHPV16 = 'Invalid'
        }

        if (this.state.result['18'] == 'Positive') {
            defaultHPV18 = 'Positive'
        } else if (this.state.result['18'] == 'Negative') {
            defaultHPV18 = 'Negative'
        }else if (this.state.result['18'] == 'Invalid') {
            defaultHPV18 = 'Invalid'
        }

        if (this.state.result['other'] == 'Positive') {
            defaultHPVOther = 'Positive'
        } else if (this.state.result['other'] == 'Negative') {
            defaultHPVOther = 'Negative'
        } else if (this.state.result['other'] == 'Invalid') {
            defaultHPVOther = 'Invalid'
        }

        return (

            <tr >
                <td className="px-lg-2" style={{ "maxWidth": "150px" }}>
                    <input
                        value={this.state.name}
                        onChange={(event) => this.sampleNameChange(this.state.index, event.target.value)} className="form-control"
                        placeholder="please enter sample name" />
                </td>

                <td >
                    <div className="form-check form-check-inline">
                        <select className="custom-select"
                            // checked={this.state.result == 'lt' ? true : false}
                            value={defaultHPV16}
                            onChange={(event) => this.sampleReferenceResultChange(this.state.index, '16', event.target.value)}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_lt"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
                            <option>Invalid</option>
                        </select>

                    </div>
                </td>

                <td>
                    <div className="form-check form-check-inline">
                        <select className="custom-select"
                            // checked={this.state.result == 'recent' ? true : false}
                            value={defaultHPV18}
                            onChange={() => this.sampleReferenceResultChange(this.state.index, '18', event.target.value)}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_recent"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
                            <option>Invalid</option>
                        </select>

                    </div>
                </td>

                <td>
                    <div className="form-check form-check-inline">
                        <select className="custom-select"
                            // checked={this.state.result == 'neg' ? true : false}
                            value={defaultHPVOther}
                            onChange={() => this.sampleReferenceResultChange(this.state.index, 'other', event.target.value)}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_neg"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
                            <option>Invalid</option>
                        </select>

                    </div>
                </td>


                <td>

                    <ReactTooltip />
                    <a onClick={() => this.props.deleteSampleRow(this.state.index)} data-tip="Delete sample">
                        <i style={{ "color": "red" }} className="fa fa-minus-circle" aria-hidden="true"></i>
                    </a>

                </td>
            </tr>

        );
    }
}

export default ShipmentSample;