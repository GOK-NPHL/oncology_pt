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
        let tdtyle = {
            textAlign: 'left',
        }

        let totalTableLength = 8;
        return (
            <React.Fragment>

                <table className="unstrip table table-sm no-table-border" ref={el => (this.componentRef = el)}>
                    <tbody >
                        <tr >
                            <td colSpan={totalTableLength}>
                                <img style={imgStyle} src={this.props.chart1}></img>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={totalTableLength}>MINISTRY OF HEALTH</td>
                        </tr>
                        <tr>
                            <td colSpan={totalTableLength}>NATIONAL PUBLIC HEALTH LABORATORIES</td>
                        </tr>
                        <tr>
                            <td colSpan={totalTableLength}>KENYA EXTERNAL QUALITY ASSESSMENT SCHEME (KNEQAS)</td>
                        </tr>
                        <tr>
                            <td colSpan={totalTableLength}>NATIONAL ONCOLOGY/BIOCHEMISTRY REFERENCE LABORATORY</td>
                        </tr>
                        <tr>
                            <td colSpan={totalTableLength}>P.O Box 20750 - 00202 NAIROBI Email: nphlpt@nphl.go.ke Help Desk: helpdesk.nphl.go.ke</td>
                        </tr>
                        <tr><p></p></tr>
                        <tr><p></p></tr>
                        <tr style={{ "marginTop": "5px" }}>

                            <td colSpan={3} style={tdtyle}>
                                <div>Lab Code: 266</div>
                                <div>Shipment Date 24-May-2021</div>
                                <div>Specimen Receipt Date 31-May-2021</div>
                                <div>Kit Lot Number</div>

                            </td>
                            <td colSpan={2} >
                                <div>Lab Name: KEMRI P3</div>
                                <div>Result Submission Date 04-Jun-2021</div>
                                <div>Testing Date 08-Jun-2021</div>
                                <div>Kit Expiration Date</div>

                            </td>
                            <td colSpan={3} style={{ 'textAlign': 'right' }}>
                                <div>Phone No: +254722539294</div>
                                <div>Platform: Roche CAP/CTM</div>
                            </td>

                        </tr>
                        <tr><p></p></tr>
                        <tr><p></p></tr>
                        <tr>
                            <td style={tdtyle} rowSpan={2}>SAMPLE </td>
                            <td colSpan={2}>HR HPV 16 </td>
                            <td colSpan={2}>HR HPV 18-45 </td>
                            <td colSpan={2}>Others HR HPV</td>
                            <td style={tdtyle} rowSpan={2}>PERFORMANCE</td>
                        </tr>

                        <tr>

                            <td>Results</td>
                            <td>Expected</td>

                            <td>Results</td>
                            <td>Expected</td>

                            <td>Results</td>
                            <td>Expected</td>

                        </tr>
                    </tbody>
                </table>

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