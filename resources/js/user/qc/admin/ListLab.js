import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { FetchSubmissions } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';


class ListLab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            submissions: [],
            isSubmitResult: false,
            dtObject: null
        }
    }

    componentDidMount() {

        (async () => {
            let response = await FetchSubmissions();
        })();

    }


    render() {

        return (
            <React.Fragment>
                alert(AddLab);
            </React.Fragment>
        );
    }

}

export default ListLab;

if (document.getElementById('list_lab')) {
    ReactDOM.render(<ListLab />, document.getElementById('list_lab'));
}