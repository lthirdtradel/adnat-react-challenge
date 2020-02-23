import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const logIn = credentials => {
  return dispatch => {
    axios
      .post("auth/login", {
        email: credentials.email,
        password: credentials.password
      })
      .then(response => {
        let sessionToken = response.data.sessionId;
        dispatch({
          type: "LOG_IN_SUCCESS",
          sessionToken
        });
      })
      .catch(error => {
        let errorMessage = error.response
          ? error.response.data.error
          : "Unable to connect to server.";
        dispatch({
          type: "LOG_IN_ERROR",
          error: errorMessage
        });
      });
  };
};

export const register = userInfo => {
  return dispatch => {
    axios
      .post("auth/signup", {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        passwordConfirmation: userInfo.passwordConfirmation
      })
      .then(response => {
        let sessionToken = response.data.sessionId;
        dispatch({
          type: "REGISTER_SUCCESS",
          sessionToken
        });
      })
      .catch(error => {
        let errorMessage = error.response.data.error;
        dispatch({
          type: "REGISTER_ERROR",
          error: errorMessage
        });
      });
  };
};

export const logOut = () => {
  return (dispatch, getState) => {
    let sessionToken = getState().sessionToken;
    if (sessionToken) {
      axios
        .delete("auth/logout", {
          headers: {
            Authorization: sessionToken,
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          dispatch({
            type: "LOG_OUT_SUCCESS"
          });
        })
        .catch(error => {
          dispatch({
            type: "LOG_OUT_ERROR",
            error
          });
        });
    }
  };
};
