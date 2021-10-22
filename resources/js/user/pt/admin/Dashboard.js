import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import DashboardSubmissionSummaries from '../../../components/utils/charts/DashboardSubmissionSummaries';
import { FetchSubmissions } from '../../../components/utils/Helpers';


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissionsSummary: []
        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
            
            this.setState({
                submissionsSummary: response
            })
        })();

    }

    render() {
        
        return (
            <React.Fragment>
                <DashboardSubmissionSummaries data={this.state.submissionsSummary} />
            </React.Fragment>
        );
    }

}

export default Dashboard;

if (document.getElementById('admin_dashboard')) {
    ReactDOM.render(<Dashboard />, document.getElementById('admin_dashboard'));
}