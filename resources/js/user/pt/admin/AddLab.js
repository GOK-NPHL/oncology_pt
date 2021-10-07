import React from 'react';
import ReactDOM from 'react-dom';
import LineGraph from '../../../components/utils/charts/LineGraph';
import RTCard from '../../../components/utils/RTCard';
import StackedHorizontal from '../../../components/utils/charts/StackedHorizontal'
import { SaveParticipant } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import ParticipantForm from './ParticipantForm';


class AddLab extends React.Component {

    constructor(props) {
        super(props);

        
    }

    componentDidMount() {

    }

    render() {

        return (
            <React.Fragment>
                <ParticipantForm />
            </React.Fragment>
        );
    }

}

export default AddLab;

if (document.getElementById('add_lab')) {
    ReactDOM.render(<AddLab />, document.getElementById('add_lab'));
}