import React from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateOragnisation } from "../../store/actions/organisationActions";
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

import NavBar from "../navbar/NavBar";

export class EditOrganisationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      hourlyRate: ""
    };
  }

  handleHourlyRateChange = event => {
    let value = event.target.value.toString();
    if (value.includes(".")) {
      let tempValue = value + "00";
      let indexOfDecimal = value.indexOf(".");
      let newValue = tempValue.substring(0, indexOfDecimal + 3);
      this.setState({
        hourlyRate: newValue
      });
    } else {
      this.setState({
        hourlyRate: event.target.value
      });
    }
  };

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleEditOrg = event => {
    event.preventDefault();

    let updatedInfo = {};

    if (this.state.name === "" && this.state.hourlyRate === "") {
      this.props.history.push("/home");
    } else {
      updatedInfo["name"] = this.state.name;

      updatedInfo["hourlyRate"] = this.state.hourlyRate;

      if (Object.keys(updatedInfo).length > 0) {
        updatedInfo["id"] = this.props.organisationId;
        this.props.updateOragnisation(updatedInfo);
        this.props.history.push("/home");
      }
    }
  };

  render() {
    if (!this.props.user) {
      return <Redirect to="/" />;
    }
    if (!this.props.location.state.organisationId) {
      return <Redirect to="/home" />;
    }
    return (
      <div>
        {this.props.profile ? (
          <div>
            <NavBar name={this.props.profile.name} />
            <Container textAlign="center" style={{ marginTop: "7em" }}>
              <Header size="huge">Edit Organization</Header>
              <Table celled selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Hourly Rate</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Input
                        placeholder="New Organization Name"
                        id="name"
                        onChange={this.handleNameChange}
                        defaultValue={this.props.organisationName}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder="New Hourly Rate"
                        id="hourlyRate"
                        type="number"
                        onChange={this.handleHourlyRateChange}
                        defaultValue={this.props.organisationHourlyRate}
                      />
                    </Table.Cell>
                    <Table.Cell width={3}>
                      <Button primary onClick={this.handleEditOrg}>
                        Save
                      </Button>

                      <Link to="/home">
                        <Button secondary>Cancel</Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
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
    organisationId: editOrganisationId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateOragnisation: newValues => {
      dispatch(updateOragnisation(newValues));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrganisationForm);
