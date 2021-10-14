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

    sampleReferenceResultChange(index, refResult) {

        this.setState({
            result: refResult
        })
        this.props.sampleReferenceResultChange(index, refResult);
    }

    sampleNameChange(index, name) {

        this.setState({
            name: name
        })
        this.props.sampleNameChange(index, name);
    }

    render() {
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
                            onChange={() => this.sampleReferenceResultChange(this.state.index, 'lt')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_lt"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
                        </select>

                    </div>
                </td>

                <td>
                    <div className="form-check form-check-inline">
                        <select className="custom-select"
                            checked={this.state.result == 'recent' ? true : false}
                            value="recent" onChange={() => this.sampleReferenceResultChange(this.state.index, 'recent')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_recent"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
                        </select>

                    </div>
                </td>

                <td>
                    <div className="form-check form-check-inline">
                        <select className="custom-select"
                            checked={this.state.result == 'neg' ? true : false}
                            value="neg" onChange={() => this.sampleReferenceResultChange(this.state.index, 'neg')}
                            name={this.state.index + "long-term-radio"} id={this.state.index + "result_neg"} >
                            <option hidden>--select--</option>
                            <option>Positive</option>
                            <option>Negative</option>
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