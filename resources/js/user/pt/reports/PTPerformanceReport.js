import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipments } from '../../../components/utils/Helpers';
import ListShipment from '../shipment/ListShipment';


class PTPerformanceReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {


        return (
            <React.Fragment>

            </React.Fragment>
        );
    }

}

export default PTPerformanceReport;

if (document.getElementById('pt_perfornance_report')) {
    ReactDOM.render(<PTPerformanceReport />, document.getElementById('pt_perfornance_report'));
}