import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { FetchAdminUsers } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";




const $ = require('jquery');
$.DataTable = require('datatables.net');

class ListUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            users: [],
            currElementsTableEl: [],
            allTableElements: [],
            selectedElement: null,
            allowedPermissions: [],
            userActionState: 'userList',
            startTableData: 0,
            endeTableData: 10,
            activePage: 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {

        (async () => {
            let response = await FetchAdminUsers();
            this.setState({
                data: response
            });
            console.log(response);
        })();

    }

    deleteUser() {
        (async () => {
            let response = await DeleteUser(this.state.selectedElement);
            this.setState({
                responseMessage: response.data.Message
            });
            $('#deleteUserModal').modal('toggle');
            this.getUsers();
        })();
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        let pgNumber = pageNumber * 10 + 1;
        this.setState({
            startTableData: pgNumber - 11,
            endeTableData: pgNumber - 1,
            activePage: pageNumber
        });
    }

    updatedSearchItem(currElementsTableEl) {
        this.setState({
            currElementsTableEl: currElementsTableEl,
            activePage: 1,
            startTableData: 0,
            endeTableData: 10,
        })
    }

    render() {
        const imgStyle = {
            width: "100%"
        };

        const rowStle = {
            marginBottom: "5px"
        };

        let tableElem = [];

        if (this.state.data.length > 0) {

            this.state.data.map((element, index) => {

                tableElem.push(<tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.name}</td>
                    <td>{element.email}</td>
                    <td>{element.phone_number}</td>
                    {

                        <td>

                            <a
                                onClick={
                                    () => {
                                        this.toggleDisplay();
                                        this.setState({
                                            userActionState: 'edit',
                                            selectedElement: element
                                        });
                                    }
                                }
                                style={{ 'marginRight': '5px' }}
                                className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                <i className="fas fa-user-edit"></i>
                            </a>
                            <a
                                onClick={() => {
                                    this.setState({
                                        selectedElement: element
                                    });
                                    $('#deleteConfirmModal').modal('toggle');
                                }} className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm">
                                <i className="fas fa-user-times"></i>
                            </a>

                        </td>
                    }

                </tr>
                );
            });
            if (this.state.allTableElements.length == 0) {
                this.setState({
                    allTableElements: tableElem,
                    currElementsTableEl: tableElem
                })
            }

        }


        let pageContent = <div id='user_table' className='row'>
            <div className='col-sm-12 col-md-12'>
                <div className="form-group mb-2">
                    <input type="text"
                        onChange={(event) => {
                            console.log(this.state.allTableElements);
                            let currElementsTableEl = this.state.allTableElements.filter(elemnt =>
                                elemnt['props']['children'][1]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase()) ||
                                elemnt['props']['children'][2]['props']['children'].toLowerCase().trim().includes(event.target.value.trim().toLowerCase())
                            );
                            this.updatedSearchItem(currElementsTableEl);
                        }}
                        className="form-control" placeholder="search user"></input>
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currElementsTableEl.slice(this.state.startTableData, this.state.endeTableData)}
                    </tbody>

                </table>
                <br />
                <Pagination
                    itemClass="page-item"
                    linkClass="page-link"
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.currElementsTableEl.length}
                    pageRangeDisplayed={5}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        </div>;

        return (
            <React.Fragment>
                {pageContent}
            </React.Fragment>
        );
    }

}

export default ListUser;

if (document.getElementById('list_admin_user')) {
    ReactDOM.render(<ListUser />, document.getElementById('list_admin_user'));
}