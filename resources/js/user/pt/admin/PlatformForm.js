import React from 'react';
import ReactDOM from 'react-dom';
import { FetchPlatformById, SavePlatform, UpdatePlatform } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import { matchPath } from "react-router";

class PlatformForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSubmitResult: false,
            message: '',
            platformName: '',
            isActive: 1,
            pageState: 'add'
        }

        this.handlePlatformNameChange = this.handlePlatformNameChange.bind(this);
        this.handleIsActiveChange = this.handleIsActiveChange.bind(this);

    }

    componentDidMount() {

        let pathname = window.location.pathname;
        let pathObject = matchPath(pathname, {
            path: `/edit-platform/:platformId`,
        });

        if (pathObject) {

            (async () => {
                let editData = await FetchPlatformById(pathObject.params.platformId);
                if (editData) {
                    editData = editData;
                }

                if (editData.status == 500) {
                    this.setState({
                        message: editData.data.Message,
                        pageState: 'edit'
                    })
                    $('#addPlatformModal').modal('toggle');
                } else {
                    this.setState({
                        id: editData.id,
                        platformName: editData.name,
                        isActive: editData.active,
                        pageState: 'edit',
                    });
                }
            })();
        }

    }

    handlePlatformNameChange(platformName) {
        this.setState({
            platformName: platformName
        });
    }

    handleIsActiveChange(isActive) {
        this.setState({
            isActive: isActive
        });
    }

    savePlatform() {

        if (

            this.state.platformName == ''
        ) {
            this.setState({
                message: "Kindly fill the required fileds marked in *"
            });
            $('#addPlatformModal').modal('toggle');
        } else {

            (async () => {

                let platform = {};
                { this.state.pageState == 'edit' ? platform['id'] = this.state.id : '' }

                platform['platform_name'] = this.state.platformName;
                platform['is_active'] = this.state.isActive;

                let response;

                if (this.state.pageState == 'edit') {
                    response = await UpdatePlatform(platform);
                    this.setState({
                        message: response.data.Message,
                    });
                } else if (this.state.pageState == 'add') {
                    response = await SavePlatform(platform);
                    if (response.status == 200) {
                        this.setState({
                            message: response.data.Message,
                            platformName: '',
                            isActive: 1
                        });
                    } else {
                        this.setState({
                            message: response.data.Message,
                        });
                    }

                }

                $('#addPlatformModal').modal('toggle');
            })();
        }


    }


    render() {

        return (
            <React.Fragment>

                <div className="card" style={{ "backgroundColor": "#ecf0f1" }}>
                    <div className="card-body">
                        <h5 className="card-title">Add New Platform</h5><br />
                        <hr />
                        <div >
                            <form action="#" >

                                <div className="form-row ">

                                    <div className="col-md-6 mb-3 ">
                                        <label htmlFor="platform_name" >Platform name *</label>
                                        <input
                                            value={this.state.platformName}
                                            onChange={(event) => this.handlePlatformNameChange(event.target.value)} type="platform_name"
                                            className="form-control" id="u_email" />
                                    </div>

                                </div>

                                <div className="form-row">

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="u_active" >Active</label>
                                        <select
                                            id="u_active"
                                            value={this.state.isActive} className="custom-select"
                                            onChange={(event) => this.handleIsActiveChange(event.target.value)}
                                        >
                                            <option value={1}>True</option>
                                            <option value={0}>False</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="form-group row mt-3">
                                    <div className="col-sm-12">
                                        <a href="#" onClick={() => this.savePlatform()} type="" className="d-inline m-2 btn btn-info m">Save</a>
                                        <a
                                            onClick={
                                                () => {
                                                    window.location.assign('/list-platforms')
                                                }
                                            }
                                            className="d-inline m-2 btn btn-danger">exit</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                < div className="modal fade" id="addPlatformModal" tabIndex="-1" role="dialog" aria-labelledby="addPlatformModalTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addPlatformModalTitle">Notice!</h5>
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

export default PlatformForm;