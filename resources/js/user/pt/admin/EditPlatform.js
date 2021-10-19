import React from 'react';
import ReactDOM from 'react-dom';
import { SaveLabPersonel, FetchParticipantList } from '../../../components/utils/Helpers';
import { v4 as uuidv4 } from 'uuid';
import PlatformForm from './PlatformForm';


class EditPlatform extends React.Component {

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

export default EditPlatform;

if (document.getElementById('edit_platform')) {
    ReactDOM.render(<EditPlatform />, document.getElementById('edit_platform'));
}