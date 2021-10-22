import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { FetchShipmentResponsesReport } from '../../../components/utils/Helpers';
import ReactToPrint from "react-to-print";

import { matchPath } from "react-router";


class PTPerformanceReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {
        // alert("pdf docuemnts 1")
        let pathname = window.location.pathname;

        let pathObject = matchPath(pathname, {
            path: `/get-shipment-response-performance/:submissionId`,
        });

        if (pathObject) {
            (async () => {

                let response = await FetchShipmentResponsesReport(pathObject.params.submissionId);

                if (response.status == 500) {
                    this.setState({
                        message: response.data.Message,
                    })
                    $('#readinessReponseModal').modal('toggle');
                } else {

                    this.setState({
                        data: response
                    });

                }
            })();
        }
    }


    render() {
        const imgStyle = {
            // width: "70%"
        };
        return (
            <React.Fragment>
                <div id='agreementRates' ref={el => (this.componentRef = el)} >
                    <img style={imgStyle} src={this.props.chart1}></img><br />
                    Test print
                </div>

                <ReactToPrint
                    trigger={() => <button style={{ textAlign: 'center', marginLeft: '50%', backgroundColor: 'lemonchiffon', width: '62px' }}>Download</button>}
                    content={() => this.componentRef}
                />
            </React.Fragment>
        );
    }

}

export default PTPerformanceReport;

if (document.getElementById('pt_perfornance_report')) {
    // find element by id
    let domValues = [];
    let domValuesMap = {};
    const dataChart1 = document.getElementById('data-chart1');
    //const dataChart2 = document.getElementById('data-chart2');

    domValues.push(dataChart1.dataset);
    //domValues.push(dataChart2.dataset);

    domValues.forEach(element => {
        for (const property in element) {
            domValuesMap[property] = element[property];
        }
    });

    const props = Object.assign({}, domValuesMap);
    ReactDOM.render(<PTPerformanceReport {...props} />, document.getElementById('pt_perfornance_report'));
}