import React, { Component } from "react";
import {
  Container,
  Loader,
  Dimmer,
  Header,
  Table,
  Button
} from "semantic-ui-react";
import CreateOrganization from "../organisations/CreateOrganisation";
import NavBar from "../navbar/NavBar";
import Organization from "../organisations/Organization";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileInformation } from "../../store/actions/usersActions";
import { getOrganisations } from "../../store/actions/organisationActions";

import { leaveOrganisation } from "../../store/actions/organisationActions";
import _ from "lodash";

export class Home extends Component {
  componentDidMount() {
    this.props.getProfileInformation();
    this.props.getOrganisations();
  }

  handleLeave = () => {
    this.props.leaveOrganisation();
  };

  render() {
    if (!this.props.user) {
      return <Redirect to="/" />;
    }
    return (
      <div style={{ marginTop: "7em" }}>
        {this.props.profile ? (
          <div>
            <NavBar name={this.props.profile.name} />
            {!this.props.profile.organisationId ? (
              <Container textAlign="center" style={{ marginTop: "7em" }}>
                You aren't a member of any organizations. Join an existing one
                or create a new one.
                <Organization />
                <CreateOrganization />
              </Container>
            ) : (
              <Container textAlign="center" style={{ marginTop: "7em" }}>
                <Header size="huge">My Organization</Header>
                <Table celled>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={8}>
                        {this.props.organisationName
                          ? this.props.organisationName
                          : "Unknown organisation name"}
                      </Table.Cell>
                      <Table.Cell width={3}>
                        <Link
                          to={{
                            pathname: "shifts",
                            state: {
                              organisationId: this.props.profile.organisationId
                            }
                          }}
                        >
                          <Button primary>View Shifts</Button>
                        </Link>

                        <Link
                          to={{
                            pathname: "oragnisation/edit",
                            state: {
                              organisationId: this.props.profile.organisationId
                            }
                          }}
                        >
                          <Button color="green">Edit</Button>
                        </Link>
                        <Button color="red" onClick={this.handleLeave}>
                          Leave
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Container>
            )}
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

const mapStateToProps = state => {
  let profile = state.profile;
  let organisations = state.organisations;
  let organisationName;
  if (profile && organisations) {
    let currentOrganisation = profile.organisationId;
    if (currentOrganisation) {
      let organisationIndex = _.findIndex(organisations, function(o) {
        return o.id === currentOrganisation;
      });
      organisationName = organisations[organisationIndex].name;
    }
  }
  var shifts;
  if (organisationName) {
    shifts = state.shifts;
  }
  return {
    user: state.sessionToken ? true : false,
    profile: state.profile,
    organisations: state.organisations,
    organisationName,
    shifts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileInformation: () => {
      dispatch(getProfileInformation());
    },
    getOrganisations: () => {
      dispatch(getOrganisations());
    },
    leaveOrganisation: () => {
      dispatch(leaveOrganisation());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
