import axios from 'axios';
import _ from 'lodash'
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getOrganisations = () => {
    // List all organisations
    return (dispatch, getState) => {
        if (getState().sessionToken) {
            let sessionToken = getState().sessionToken;
            let request = axios.create({
                headers: {
                    get: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.get("/organisations")
                .then((response) => {
                    let organisations = response.data;
                    dispatch({
                        type: "GET_ORGANISATIONS_SUCCESS",
                        organisations
                    })
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error;
                    dispatch({
                        type: "GET_ORGANISATIONS_ERROR",
                        error: errorMessage
                    })
                });
        }
    }
}

export const createJoinOrganisation = (organisationInfo) => {
    // Create a new organisation and join
    return (dispatch, getState) => {
        if (getState().sessionToken && !getState().profile.organisationId) {
            let sessionToken = getState().sessionToken;

            let request = axios.create({
                headers: {
                    post: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.post("/organisations/create_join", {
                    name: organisationInfo.name,
                    hourlyRate: organisationInfo.hourlyRate
                })
                .then((response) => {
                    let organisation = {
                        id: response.data.id,
                        name: response.data.name,
                        hourlyRate: response.data.hourlyRate
                    }
                    dispatch({
                        type: "CREATE_JOIN_ORG_SUCCESS",
                        organisation
                    })
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error;
                    dispatch({
                        type: "CREATE_JOIN_ORG_ERROR",
                        error: errorMessage
                    })
                });
        }
    }
}

export const joinOrganisation = (organisationId) => {
    // Join an organisation if user is not already apart of one
    return (dispatch, getState) => {
        if (getState().sessionToken && !getState().profile.organisationId) {
            let sessionToken = getState().sessionToken;

            let request = axios.create({
                headers: {
                    post: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });
            request.post("/organisations/join", {
                    organisationId
                })
                .then((response) => {
                    let organisation = {
                        id: response.data.id,
                        name: response.data.name,
                        hourlyRate: response.data.hourlyRate
                    }
                    dispatch({
                        type: "JOIN_ORGANISATION_SUCCESS",
                        organisation
                    })
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error;
                    dispatch({
                        type: "JOIN_ORGANISATION_ERROR",
                        error: errorMessage
                    })
                });
        }
    }
}

export const updateOragnisation = (organisationInfo) => {
    // Edit organisation information
    return (dispatch, getState) => {
        if (getState().sessionToken && organisationInfo.id) {
            let sessionToken = getState().sessionToken;
            let request = axios.create({
                headers: {
                    put: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            let orgId = organisationInfo.id;
            let organisationUpdateData = _.omit(organisationInfo, ['id']);

            request.put(`organisations/${organisationInfo.id}`, {
                    ...organisationUpdateData
                })
                .then((response) => {
                    if (response.status === 200) {
                        let organisations = getState().organisations;
                        let organisationIndex = _.findIndex(organisations, function (o) {
                            return o.id === orgId;
                        });
                        let currentOrgInfo = organisations[organisationIndex]
                        let updatedOrgInfo = {
                            ...currentOrgInfo,
                            ...organisationUpdateData
                        }
                        organisations[organisationIndex] = updatedOrgInfo;
                        dispatch({
                            type: "ORG_UPDATE_SUCCESS",
                            organisations
                        })

                    }
                })
                .catch((error) => {
                    dispatch({
                        type: "ORG_UPDATE_ERROR",
                        error
                    })
                });

        }
    }
}

export const leaveOrganisation = () => {
    // Leave organistion
    return (dispatch, getState) => {
        if (getState().sessionToken && getState().profile.organisationId) {
            let sessionToken = getState().sessionToken;
            let request = axios.create({
                headers: {
                    post: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.post("organisations/leave")
                .then((response) => {
                    let profile = {
                        organisationId: response.data.organisationId,
                        name: response.data.name,
                        email: response.data.email
                    }
                    dispatch({
                        type: "LEAVE_ORG_SUCCESS",
                        profile
                    })
                })
                .catch((error) => {
                    dispatch({
                        type: "LEAVE_ORG_ERROR",
                        error
                    })
                });

        }
    }
}