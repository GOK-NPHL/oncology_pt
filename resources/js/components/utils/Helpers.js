import { settings } from './Settings'

const axios = require('axios');

let cache = {
    orgunitList: null,

}

export async function SaveSubmission(submission) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_submission`,
            data: {
                submission: submission,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function FetchSubmissions() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_submissions`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchUserSamples() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_samples`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchSampleResponseResultById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_sample_response_result/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurvey() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurveyById(readinessId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey_by_id/` + readinessId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchReadnessSurveyByIdAndLab(readinessId, labId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_survey_by_id_and_labid/` + readinessId + '/' + labId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchCurrentParticipantDemographics(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participant_demographics/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchSubmission(shipmentId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_submission_by_id/` + shipmentId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function UpdateSubmission(submission) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_submission`,
            data: {
                submission: submission,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function UpdateOwnBio(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/own_bio_update`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function FetchAdminUsers() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_users`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function FetchAdminUser(userId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_user/` + userId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }

}

export async function SaveAdminUser(user) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_admin`,
            data: {
                user: user,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdateAdminUser(user) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_admin`,
            data: {
                user: user,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function FetchParticipantList() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participants`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchParticipant(labId) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_participant/` + labId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveParticipant(lab) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_participant`,
            data: {
                lab: lab,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function EditParticipant(lab) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_participant`,
            data: {
                lab: lab,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}


export async function FetchCounties() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_counties/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchLabPersonel() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lab_personel`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchLabPersonelById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lab_personel/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchPlatformById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_platform/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchPlatform() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_platforms`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveLabPersonel(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_lab_personel`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function SavePlatform(platform) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_platform`,
            data: {
                platform: platform,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdateLabPersonel(personel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_lab_personel`,
            data: {
                personel: personel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdatePlatform(platform) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_platform`,
            data: {
                platform: platform,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function SaveReadiness(readiness) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_readiness`,
            data: {
                readiness: readiness,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function UpdateReadiness(readiness) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_readiness`,
            data: {
                readiness: readiness,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function FetchReadinessById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_by_id/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchReadiness() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentReadiness() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_readiness`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentById(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_by_id/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveShipment(shipement) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_shipment`,
            data: {
                shipement: shipement,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function UpdateShipment(shipement) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/update_shipment`,
            data: {
                shipement: shipement,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err.response);
        return err.response
    }
}

export async function FetchShipments(userId, with_subs) {

    try {
        let url = `${settings.serverBaseApi}/get_shipments?a=1`;
        if(with_subs && with_subs == 1) {
            url += `&with_submissions=1`;
        }
        if(userId) {
            url += `&user_id=${userId}`;
        }
        const response = await axios.get(url);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}
export async function FetchShipments_Old(userId, filterEmpty) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipments/` + userId + '/' + filterEmpty);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

//// <lots //
export async function FetchLots() {

    try {
        let url = `${settings.serverBaseApi}/get_lots`;
        const response = await axios.get(url);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchLot(lotId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_lot/` + lotId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SaveLot(lot) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_lot`,
            data: {
                lot: lot,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdateLot(lot) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_lot`,
            data: {
                lot: lot,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function DeleteLot(lotId) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/delete_lot/${lotId}}`,
            // data: {
            //     id: lotId,
            // }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}
///// lots> //

///// <panels //
export async function FetchPanels() {

    try {
        let url = `${settings.serverBaseApi}/get_panels`;
        const response = await axios.get(url);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchPanel(panelId) {
    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_panel/` + panelId);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function SavePanel(panel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/create_panel`,
            data: {
                panel: panel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function UpdatePanel(panel) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/edit_panel`,
            data: {
                panel: panel,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}

export async function DeletePanel(panelId) {
    try {
        const response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/delete_panel/${panelId}`,
            // data: {
            //     id: panelId,
            // }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }
}
///// panels> //



export async function SaveSuveyAnswers(survey) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/save_survey_answers`,
            data: {
                survey: survey,
            }
        });
        return response;
    } catch (err) {
        // Handle Error Here
        console.log(err);
        return err.response
    }

}

export async function ApproveReadinessAnswer(readinessId, labId) {
    try {
        const response = await axios({
            method: 'post',
            url: `${settings.serverBaseApi}/approve_readiness_answer`,
            data: {
                readiness_id: readinessId,
                lab_id: labId
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return err.response
    }

}

export async function FetchReadinessResponses(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_readiness_response/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentResponses(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_responses/` + id);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchShipmentResponsesReport(id, isPart) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_shipment_response_report/` + id + '/' + isPart);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchuserId(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_id/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchuserParams(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_user_params/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}

export async function FetchAdminParams(id) {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/get_admin_params/`);
        const responseData = response.data;
        return responseData;
    } catch (err) {
        // Handle Error Here
        return err.response
    }
}


export function exportToExcel(bundle, filename) {
    console.log('Exporting to Excel');
    if (!filename || filename == '' || filename == null || filename == undefined) {
        filename = 'data';
    }
    // let bundle = this.state.data
    if (bundle.length > 0) {
        let csv = '';
        filename = filename + '-' + new Date().toLocaleDateString().split('/').join('_') + '.csv'
        let keys = Object.keys(bundle[0])//.map(key => key.split('_').join(' '));
        csv += keys.join(',') + '\r\n';
        bundle.forEach(item => {
            csv += keys.map(key => item[key]).join(',') + '\r\n';
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            if (document && document.createElement) {
                let link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                } else {
                    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                }
                link.style.visibility = 'hidden';
                // link.textContent = 'Download '+filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else {
                if (window && window.open) {
                    window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                }
            }
        }
        console.log('Exported to Excel');
    } else {
        console.log('No data to export');
        alert('No data to export');
    }
}


export async function FetchAllFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_all`);
        const flList = response.data;
        return flList;
    } catch (err) {
        return err.response
    }
}

export async function FetchPublicFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_public`);
        const pbFlst = response.data;
        return pbFlst;
    } catch (err) {
        return err.response
    }
}
export async function FetchPrivateFiles() {

    try {
        const response = await axios.get(`${settings.serverBaseApi}/resources/files_private`);
        const prvFlst = response.data;
        return prvFlst;
    } catch (err) {
        return err.response
    }
}

export async function SaveFile(payload, isPub = false) {
    let response;
    try {
        const formData = new FormData();
        formData.append('file', payload);
        formData.append('isPublic', isPub);
        response = await axios.post(`${settings.serverBaseApi}/resources/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (err) {
        return err.response
    }
}

export async function DeleteFile(fileId) {
    let response;
    try {
        response = await axios({
            method: 'delete',
            url: `${settings.serverBaseApi}/resources/files/${fileId}`,
        });
        return response;
    } catch (err) {
        return err.response
    }
}