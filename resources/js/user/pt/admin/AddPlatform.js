import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import PlatformForm from './PlatformForm';


class AddPlatform extends React.Component {

    constructor(props) {
        super(props);


    }

    componentDidMount() {

    }


    render() {

        return (
            <React.Fragment>
                <PlatformForm />
            </React.Fragment>
        );
    }

}

export default AddPlatform;

if (document.getElementById('add_platform')) {
    ReactDOM.render(<AddPlatform />, document.getElementById('add_platform'));
}