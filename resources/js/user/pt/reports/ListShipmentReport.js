import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import Pagination from "react-js-pagination";
import { FetchShipments } from '../../../components/utils/Helpers';
import ListShipment from '../shipment/ListShipment';


class ListShipmentReport extends React.Component {

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
                <ListShipment page={'report'} />
            </React.Fragment>
        );
    }

}

export default ListShipmentReport;

if (document.getElementById('pt_shipment_report')) {
    ReactDOM.render(<ListShipmentReport />, document.getElementById('pt_shipment_report'));
}