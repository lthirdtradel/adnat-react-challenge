import React from "react";
import { Container, Divider, Button, Header, Table } from "semantic-ui-react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getOrganisations } from "../../store/actions/organisationActions";
import { getProfileInformation } from "../../store/actions/usersActions";
import { joinOrganisation } from "../../store/actions/organisationActions";
import { leaveOrganisation } from "../../store/actions/organisationActions";

class Organization extends React.Component {
  componentDidMount() {
    this.props.getProfileInformation();
    this.props.getOrganisations();
  }

  getOrganisationsTable() {
    let { organisations } = this.props;
    if (organisations) {
      if (organisations.length > 0) {
        let rows = _.map(organisations, org => {
          return (
            <Table.Row key={org.id}>
              <Table.Cell width={8}>{org.name}</Table.Cell>
              <Table.Cell width={2}>
                <Link
                  to={{
                    pathname: "/oragnisation/edit",
                    state: { organisationId: org.id }
                  }}
                >
                  <Button color="green">Edit</Button>
                </Link>

                <Button primary id={org.id} onClick={this.handleJoin}>
                  Join
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        });
        return rows;
      } else {
        return (
          <Container
            textAlign="center"
            style={{ marginBottom: "2em", marginTop: "2em" }}
          >
            No organizations found. Create a new one.
          </Container>
        );
      }
    }
  }

  handleJoin = event => {
    let organisationId = event.target.id;
    this.props.joinOrganisation(organisationId);
  };

  render() {
    return (
      <Container textAlign="center" style={{ marginTop: "2em" }}>
        <Header size="huge">Organizations</Header>
        <Container textAlign="justified">
          <Divider />
          <Table celled>
            <Table.Body>{this.getOrganisationsTable()}</Table.Body>
          </Table>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.sessionToken ? true : false,
    profile: state.profile,
    organisations: state.organisations
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
    joinOrganisation: organisationId => {
      dispatch(joinOrganisation(organisationId));
    },
    leaveOrganisation: () => {
      dispatch(leaveOrganisation());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Organization);
