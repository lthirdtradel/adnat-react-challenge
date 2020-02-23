import axios from "axios";
import _ from "lodash";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const getOrganizations = () => {
  return (dispatch, getState) => {
    if (getState().sessionToken) {
      let sessionToken = getState().sessionToken;
      let request = axios.create({
        headers: {
          get: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });

      request
        .get("/organisations")
        .then(response => {
          let organizations = response.data;
          dispatch({
            type: "GET_OrganizationS_SUCCESS",
            organizations
          });
        })
        .catch(error => {
          let errorMessage = error.response.data.error;
          dispatch({
            type: "GET_OrganizationS_ERROR",
            error: errorMessage
          });
        });
    }
  };
};

export const createJoinOrganization = organizationInfo => {
  return (dispatch, getState) => {
    if (getState().sessionToken && !getState().profile.organizationId) {
      let sessionToken = getState().sessionToken;

      let request = axios.create({
        headers: {
          post: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });

      request
        .post("/organisations/create_join", {
          name: organizationInfo.name,
          hourlyRate: organizationInfo.hourlyRate
        })
        .then(response => {
          let organization = {
            id: response.data.id,
            name: response.data.name,
            hourlyRate: response.data.hourlyRate
          };
          dispatch({
            type: "CREATE_JOIN_ORG_SUCCESS",
            organization
          });
        })
        .catch(error => {
          let errorMessage = error.response.data.error;
          dispatch({
            type: "CREATE_JOIN_ORG_ERROR",
            error: errorMessage
          });
        });
    }
  };
};

export const joinOrganization = organizationId => {
  return (dispatch, getState) => {
    if (getState().sessionToken && !getState().profile.organizationId) {
      let sessionToken = getState().sessionToken;

      let request = axios.create({
        headers: {
          post: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });
      request
        .post("/organisations/join", {
          organizationId
        })
        .then(response => {
          let organization = {
            id: response.data.id,
            name: response.data.name,
            hourlyRate: response.data.hourlyRate
          };
          dispatch({
            type: "JOIN_Organization_SUCCESS",
            organization
          });
        })
        .catch(error => {
          let errorMessage = error.response.data.error;
          dispatch({
            type: "JOIN_Organization_ERROR",
            error: errorMessage
          });
        });
    }
  };
};

export const updateOrganization = organizationInfo => {
  return (dispatch, getState) => {
    if (getState().sessionToken && organizationInfo.id) {
      let sessionToken = getState().sessionToken;
      let request = axios.create({
        headers: {
          put: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });

      let orgId = organizationInfo.id;
      let organizationUpdateData = _.omit(organizationInfo, ["id"]);

      request
        .put(`organizations/${organizationInfo.id}`, {
          ...organizationUpdateData
        })
        .then(response => {
          if (response.status === 200) {
            let organizations = getState().organizations;
            let organizationIndex = _.findIndex(organizations, function(o) {
              return o.id === orgId;
            });
            let currentOrgInfo = organizations[organizationIndex];
            let updatedOrgInfo = {
              ...currentOrgInfo,
              ...organizationUpdateData
            };
            organizations[organizationIndex] = updatedOrgInfo;
            dispatch({
              type: "ORG_UPDATE_SUCCESS",
              organizations
            });
          }
        })
        .catch(error => {
          dispatch({
            type: "ORG_UPDATE_ERROR",
            error
          });
        });
    }
  };
};

export const leaveOrganization = () => {
  return (dispatch, getState) => {
    if (getState().sessionToken && getState().profile.organizationId) {
      let sessionToken = getState().sessionToken;
      let request = axios.create({
        headers: {
          post: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });

      request
        .post("organizations/leave")
        .then(response => {
          let profile = {
            organizationId: response.data.organizationId,
            name: response.data.name,
            email: response.data.email
          };
          dispatch({
            type: "LEAVE_ORG_SUCCESS",
            profile
          });
        })
        .catch(error => {
          dispatch({
            type: "LEAVE_ORG_ERROR",
            error
          });
        });
    }
  };
};
