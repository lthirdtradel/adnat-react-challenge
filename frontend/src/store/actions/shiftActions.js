import axios from "axios";
import moment from "moment";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const getShifts = () => {
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
        .get("/shifts")
        .then(response => {
          let shifts = response.data;
          dispatch({
            type: "GET_SHIFTS_SUCCESS",
            shifts
          });
        })
        .catch(error => {
          let errorMessage = error.response.data.error;
          dispatch({
            type: "GET_SHIFTS_ERROR",
            error: errorMessage
          });
        });
    }
  };
};

export const createShift = shiftInformation => {
  // Create a new shift at an organisation
  return (dispatch, getState) => {
    if (getState().sessionToken && getState().profile.organisationId) {
      let sessionToken = getState().sessionToken;
      let request = axios.create({
        headers: {
          post: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        }
      });

      let shiftDate = shiftInformation.shiftDate;
      let formattedshiftDate = moment(shiftDate).format("YYYY-MM-DD");
      let start = `${formattedshiftDate} ${shiftInformation.startTime}`;
      let finish = `${formattedshiftDate} ${shiftInformation.finishTime}`;
      let breakLength = shiftInformation.breakLength
        ? shiftInformation.breakLength
        : 0;
      request
        .post("/shifts", {
          userId: getState().profile.personalId,
          start: start,
          finish: finish,
          breakLength: breakLength
        })
        .then(response => {
          let shift = response.data;
          let shiftIndex = getState().shifts.length;
          dispatch({
            type: "CREATE_SHIFT_SUCCESS",
            index: shiftIndex,
            item: shift
          });
        })
        .catch(error => {
          let errorMessage = error.response.data.error;
          dispatch({
            type: "CREATE_SHIFT_ERROR",
            error: errorMessage
          });
        });
    }
  };
};
