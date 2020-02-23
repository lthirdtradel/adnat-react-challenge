import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { createShift } from "../../store/actions/shiftActions";
import { getShifts } from "../../store/actions/shiftActions";
import { getOrganisationUsers } from "../../store/actions/usersActions";
import NavBar from "../navbar/NavBar";
import moment from "moment";
import _ from "lodash";
import {
  Container,
  Loader,
  Dimmer,
  Header,
  Table,
  Button,
  Input
} from "semantic-ui-react";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export class ViewShifts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      startTime: null,
      finishTime: null,
      breakLength: 0
    };
  }

  componentDidMount() {
    this.props.getOrganisationUsers();
    this.props.getShifts();
  }

  getShiftsTable() {
    var rows = [];
    if (this.state.shifts) {
      _.each(this.state.shifts, shift => {
        let date = moment(shift.start, "YYYY-MM-DD HH:mm").format(
          "DD MMM YYYY"
        );
        let start = moment(shift.start).format("hh:mm a");
        let finish = moment(shift.finish).format("hh:mm a");

        var duration = moment.duration(
          moment(new Date(shift.finish)).diff(moment(new Date(shift.start)))
        );
        var workedTime = duration.asHours() - shift.breakLength / 60;

        var usersName = this.getUsersName(shift.userId);
        let row = (
          <Table.Row key={shift.id}>
            <Table.Cell>{usersName}</Table.Cell>
            <Table.Cell>{date} </Table.Cell>
            <Table.Cell>{start} </Table.Cell>
            <Table.Cell>{finish} </Table.Cell>
            <Table.Cell>{shift.breakLength}</Table.Cell>
            <Table.Cell>{Number(workedTime.toFixed(2))} </Table.Cell>
            <Table.Cell>
              {" "}
              {Number(
                (workedTime * this.props.organisationHourlyRate).toFixed(2)
              )}
            </Table.Cell>
          </Table.Row>
        );
        rows.push(row);
      });
    }
    return rows;
  }

  getUsersName = userId => {
    var usersName;
    if (this.props.users) {
      let userIndex = _.findIndex(this.props.users, function(u) {
        return u.id === userId;
      });
      if (userIndex !== -1) {
        usersName = this.props.users[userIndex].name;
      }
    }
    return usersName;
  };

  handleRemoveShift = event => {
    let shiftId = event.target.id;
    if (shiftId) {
      this.props.deleteShift(shiftId);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      shifts: nextProps.shifts
    });
  }

  handleUpdateShiftDate = newDate => {
    this.setState({
      startDate: newDate
    });
  };

  handleUpdateShiftStart = startTime => {
    this.setState({ startTime });
  };

  handleUpdateShiftFinish = finishTime => {
    this.setState({ finishTime });
  };

  handleAddShift = event => {
    event.preventDefault();

    let startDate = this.state.startDate;
    let breakLength = this.state.breakLength;

    startDate = moment(startDate, "YYYY-MM-DD HH:mm").format("DD MMM YYYY");

    let { startTime, finishTime } = this.state;

    if (startTime != null && finishTime != null) {
      startTime = moment(startTime).format("hh:mm a");
      finishTime = moment(finishTime).format("hh:mm a");

      this.props.createShift({
        startTime,
        startDate,
        finishTime,
        breakLength
      });
      this.setState({
        startDate: new Date(),
        startTime: null,
        finishTime: null,
        breakLength: 0
      });
    }
  };

  handleBreakLengthUpdate = event => {
    let newState = parseInt(event.target.value);
    let StringNewState = event.target.value.toString();
    if (StringNewState.length === 0) {
      this.setState({ breakLength: 0 });
      event.target.value = "";
    } else if (newState >= 0 && newState < 60) {
      this.setState({ breakLength: newState });
    } else if (newState > 60) {
      this.setState({ breakLength: 60 });
      event.target.value = 60;
    }
  };

  render() {
    if (!this.props.user) {
      return <Redirect to="/" />;
    }
    var numberOfShifts = this.state.shifts ? this.state.shifts.length : 0;

    return (
      <div>
        {this.props.profile ? (
          <div>
            <NavBar name={this.props.profile.name} />
            <Container>
              {numberOfShifts > 0 ? (
                <Container textAlign="center" style={{ marginTop: "7em" }}>
                  <Header size="huge">Shifts</Header>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Employee Name</Table.HeaderCell>
                        <Table.HeaderCell>Shift Date</Table.HeaderCell>
                        <Table.HeaderCell>Start Time</Table.HeaderCell>
                        <Table.HeaderCell>Finish Time</Table.HeaderCell>
                        <Table.HeaderCell>
                          Break Length (minutes)
                        </Table.HeaderCell>
                        <Table.HeaderCell>Hours Worked</Table.HeaderCell>
                        <Table.HeaderCell>Shift Cost</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>{this.getShiftsTable()}</Table.Body>
                  </Table>
                </Container>
              ) : (
                <Container textAlign="center" style={{ marginTop: "7em" }}>
                  <Header size="medium">No Existing Shift</Header>
                </Container>
              )}
              <Container
                textAlign="center"
                style={{ marginTop: "2em" }}
                id="create-shift-form"
              >
                <Header size="huge">Add Shift</Header>
                <Table celled>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="date"
                            label="Date"
                            KeyboardButtonProps={{
                              "aria-label": "change date"
                            }}
                            value={this.state.startDate}
                            onChange={this.handleUpdateShiftDate}
                          />
                        </MuiPickersUtilsProvider>
                      </Table.Cell>
                      <Table.Cell>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            ampm={false}
                            margin="normal"
                            id="startTime"
                            label="Start Time"
                            KeyboardButtonProps={{
                              "aria-label": "change time"
                            }}
                            value={this.state.startTime}
                            onChange={this.handleUpdateShiftStart}
                          />
                        </MuiPickersUtilsProvider>
                      </Table.Cell>
                      <Table.Cell>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardTimePicker
                            ampm={false}
                            margin="normal"
                            id="endTime"
                            label="End Time"
                            KeyboardButtonProps={{
                              "aria-label": "change time"
                            }}
                            value={this.state.finishTime}
                            onChange={this.handleUpdateShiftFinish}
                          />
                        </MuiPickersUtilsProvider>
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          placeholder="Break Time"
                          type="number"
                          min="0"
                          max="60"
                          onChange={this.handleBreakLengthUpdate}
                          defaultValue={0}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Button primary onClick={this.handleAddShift}>
                          Add Shift
                        </Button>
                        <Link to="/home">
                          <Button secondary>Back</Button>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Container>
            </Container>
          </div>
        ) : (
          <Dimmer active inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let editOrganisationId = ownProps.location.state
    ? ownProps.location.state.organisationId
    : null;
  if (editOrganisationId) {
    let organisations = state.organisations;
    var organisationName, organisationHourlyRate;
    if (organisations) {
      let organisationIndex = _.findIndex(organisations, function(o) {
        return o.id === editOrganisationId;
      });
      organisationName = organisations[organisationIndex].name;
      organisationHourlyRate = organisations[organisationIndex].hourlyRate;
    }
  }

  return {
    user: state.sessionToken ? true : false,
    profile: state.profile,
    organisationName,
    organisationHourlyRate,
    organisationId: editOrganisationId,
    shifts: state.shifts,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createShift: shiftInfo => {
      dispatch(createShift(shiftInfo));
    },
    getShifts: () => {
      dispatch(getShifts());
    },
    getOrganisationUsers: () => {
      dispatch(getOrganisationUsers());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewShifts);
