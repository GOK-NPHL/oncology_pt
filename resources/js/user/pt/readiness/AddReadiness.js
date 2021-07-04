import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAdminUser, FetchParticipantList, SaveReadiness } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import DualListBox from 'react-dual-listbox';

class AddReadiness extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            message: '',
            name: '',
            startDate: '',
            endDate: '',
            selected: [],
            dualListptions: [],
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.authoritiesOnChange = this.authoritiesOnChange.bind(this);

    }

    componentDidMount() {

        (async () => {
            let partsList = await FetchParticipantList();
            this.setState({
                dualListptions: partsList
            })
        })();

    }

    handleNameChange(name) {
        this.setState({
            name: name
        });
    }

    handleStartDateChange(startDate) {
        this.setState({
            startDate: startDate
        });
    }

    handleEndDateChange(endDate) {
        this.setState({
            endDate: endDate
        });
    }

    authoritiesOnChange(selected) {
        this.setState({ selected: selected });
    }

    saveReadiness() {

        if (
            this.state.name == '' ||
            this.state.start_date == '' ||
            this.state.end_date == '' ||
            this.state.selected.length == 0
        ) {
            console.log(this.state.name, this.state.start_date, this.state.end_date, this.state.selected.length)
            this.setState({
                message: "Kindly fill all fileds marked * in the form"
            })
            $('#addAdminUserModal').modal('toggle');
        } else {
            (async () => {
                let readiness = {};
                readiness['name'] = this.state.name;
                readiness['start_date'] = this.state.startDate;
                readiness['end_date'] = this.state.endDate;
                readiness['participants'] = this.state.selected;
                let response = await SaveReadiness(readiness);
                console.log(response);
                if (response.status == 200) {
                    this.setState({
                        message: response.data.Message,
                        startDate: '',
                        endDate: '',
                        name: '',
                        selected: []
                    });
                } else {
                    this.setState({
                        message: response.data.Message,
                    });
                }

                $('#addAdminUserModal').modal('toggle');

            })();
        }

    }

    render() {
        // console.log(this.state.dualListptions);
        let dualListValues = [];
        if (this.state.dualListptions.length != 0) {
            dualListValues = this.state.dualListptions.map((participant) => {
                let pat = {};
                pat['value'] = participant.id;
                pat['label'] = participant.lab_name;
                return pat;
            })
        }

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">Add Readiness Checklist</h5><br />
                        <hr />
                        <div style={{ "margin": "0 auto", "width": "60%" }} className="text-center">
                            <form action="#" >
                                <div className="form-group row">
                                    <label htmlFor="u_name" className="col-sm-2 col-form-label">Name *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.name}
                                            onChange={(event) => this.handleNameChange(event.target.value)}
                                            type="email" className="form-control" id="u_name" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="u_start_date" className="col-sm-2 col-form-label">Start date *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.startDate}
                                            onChange={(event) => this.handleStartDateChange(event.target.value)} type="date"
                                            className="form-control" id="u_start_date" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="u_end_date" className="col-sm-2 col-form-label">End Date *</label>
                                    <div className="col-sm-10">
                                        <input
                                            value={this.state.endDate}
                                            onChange={(event) => this.handleEndDateChange(event.target.value)} type="date"
                                            className="form-control" id="u_end_date" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-sm-6 mb-3">
                                        <label className="float-left">Assign facilities *</label><br />
                                    </div>
                                </div>
                                <div className="form-row">

                                    {/* <div className="col-sm-2 mb-3"></div> */}
                                    <div className="col-sm-12 mb-3">

                                        <DualListBox
                                            canFilter
                                            options={dualListValues}
                                            selected={this.state.selected}
                                            onChange={this.authoritiesOnChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-10 mt-3">
                                        <a href="#" onClick={() => this.saveReadiness()} type="" className="d-inline m-2 btn btn-primary m">Send Readiness</a>
                                        <a href="list-readiness" className="d-inline m-2 btn btn-danger">Cancel</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addAdminUserModal" tabIndex="-1" role="dialog" aria-labelledby="addAdminUserModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addAdminUserModalTitle">Notice!</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.message ? this.state.message : ''
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

export default AddReadiness;

if (document.getElementById('add_readiness')) {
    ReactDOM.render(<AddReadiness />, document.getElementById('add_readiness'));
}