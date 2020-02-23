const initState = {
  sessionToken: null,
  errorMessage: null
};

const rootReducer = (state = initState, action) => {
  let profile = state.profile;
  let organisations = state.organisations;
  switch (action.type) {
    case "REGISTER_SUCCESS":
      return {
        ...state,
        sessionToken: action.sessionToken,
        errorMessage: null
      };
    case "REGISTER_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        sessionToken: action.sessionToken,
        errorMessage: null
      };
    case "LOG_IN_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        sessionToken: null,
        errorMessage: null,
        profile: null
      };
    case "LOG_OUT_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "PROFILE_INFORMATION_SUCCESS":
      return {
        ...state,
        profile: action.profile
      };
    case "PROFILE_INFORMATION_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "GET_USERS_SUCCESS":
      return {
        ...state,
        users: action.users
      };
    case "GET_USERS_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "GET_ORGANISATIONS_SUCCESS":
      return {
        ...state,
        organisations: action.organisations
      };
    case "GET_ORGANISATIONS_ERROR":
      return state;
    case "CREATE_JOIN_ORG_SUCCESS":
      organisations.push(action.organisation);
      return {
        ...state,
        organisations,
        profile: {
          ...profile,
          organisationId: action.organisation.id
        }
      };
    case "CREATE_JOIN_ORG_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "JOIN_ORGANISATION_SUCCESS":
      return {
        ...state,
        profile: {
          ...profile,
          organisationId: action.organisation.id
        }
      };
    case "JOIN_ORGANISATION_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "ORG_UPDATE_SUCCESS":
      return {
        ...state,
        organisations: action.organisations
      };
    case "ORG_UPDATE_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "LEAVE_ORG_SUCCESS":
      return {
        ...state,
        profile: {
          ...profile,
          organisationId: null
        }
      };
    case "LEAVE_ORG_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "GET_SHIFTS_SUCCESS":
      return {
        ...state,
        shifts: action.shifts
      };
    case "GET_SHIFTS_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    case "CREATE_SHIFT_SUCCESS":
      return {
        ...state,
        shifts: insertItem(state.shifts, {
          index: action.index,
          item: action.item
        })
      };
    case "CREATE_SHIFT_ERROR":
      return {
        ...state,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

function insertItem(array, action) {
  let newArray = array.slice();
  newArray.splice(action.index, 0, action.item);
  return newArray;
}

export default rootReducer;
