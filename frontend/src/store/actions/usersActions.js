import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getOrganisationUsers = () => {
    // Get all users at an organisation
    return (dispatch, getState) => {
        if (getState().sessionToken && getState().profile.organisationId) {
            let sessionToken = getState().sessionToken;

            let request = axios.create({
                headers: {
                    get: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.get("users")
                .then((response) => {
                    dispatch({
                        type: "GET_USERS_SUCCESS",
                        users: response.data
                    })
                })
                .catch((error) => {
                    dispatch({
                        type: "GET_USERS_ERROR",
                        error
                    })
                });

        }
    }
}

export const getProfileInformation = () => {
    // Get all information about user with current session
    return (dispatch, getState) => {
        if (!getState().profile && getState().sessionToken) {
            let sessionToken = getState().sessionToken;
            let request = axios.create({
                headers: {
                    get: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.get("users/me")
                .then((response) => {
                    let profile = {
                        personalId: response.data.id,
                        organisationId: response.data.organisationId,
                        name: response.data.name,
                        email: response.data.email
                    }
                    dispatch({
                        type: "PROFILE_INFORMATION_SUCCESS",
                        profile
                    })
                })
                .catch((error) => {
                    dispatch({
                        type: "PROFILE_INFORMATION_ERROR",
                        error
                    })
                });
        }
    }
}

export const updateUserDetails = (newDetails) => {
    // Edit current session user's profile details
    return (dispatch, getState) => {
        if (getState().profile && getState().sessionToken) {
            let sessionToken = getState().sessionToken;
            let request = axios.create({
                headers: {
                    put: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.put("users/me", {
                    ...newDetails
                })
                .then((response) => {
                    let profile = {
                        organisationId: response.data.organisationId,
                        name: response.data.name,
                        email: response.data.email
                    }
                    dispatch({
                        type: "UPDATE_PROFILE_SUCCESS",
                        profile
                    })
                })
                .catch((error) => {
                    dispatch({
                        type: "UPDATE_PROFILE_ERROR",
                        error
                    })
                });
        }
    }
}

export const updateUserPassword = (passwords) => {
    // Update current session user's password
    return (dispatch, getState) => {
        if (getState().sessionToken) {
            let sessionToken = getState().sessionToken;

            let request = axios.create({
                headers: {
                    put: {
                        'Authorization': sessionToken,
                        'Content-Type': 'application/json'
                    }
                }
            });

            request.put("/users/me/change_password", {
                    ...passwords
                })
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: "UPDATE_PASSWORD_SUCCESS"
                        })
                    }
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error
                    dispatch({
                        type: "UPDATE_PASSWORD_ERROR",
                        error: errorMessage
                    })
                })
        }
    }
}