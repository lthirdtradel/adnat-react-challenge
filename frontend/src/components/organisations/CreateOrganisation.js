import React from "react";
import { connect } from "react-redux";
import { createJoinOrganisation } from "../../store/actions/organisationActions";
import {
  Container,
  Header,
  Divider,
  Input,
  Form,
  Button
} from "semantic-ui-react";

export class CreateOrganisationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      hourlyRate: ""
    };
  }

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    });
  };

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

  handleCreateOrg = event => {
    event.preventDefault();
    let organisationInfo = this.state;
    let { name, hourlyRate } = this.state;
    if (name.length > 0 && hourlyRate.length > 0) {
      this.props.createJoinOrganisation(organisationInfo);
    }
  };

  render() {
    return (
      <Container text style={{ marginTop: "2em" }}>
        <Container textAlign="center">
          <Header size="huge">Create Organization</Header>
        </Container>
        <Container textAlign="justified">
          <Divider />
          <Form>
            <Form.Group inline>
              <Form.Field>
                <label>Name</label>
                <Input
                  placeholder="Name"
                  id="name"
                  onChange={this.handleNameChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Hourly Rate: $</label>
                <Input
                  placeholder="Hourly Rate"
                  id="hourlyRate"
                  type="number"
                  onChange={this.handleHourlyRateChange}
                />
              </Form.Field>
              <Button color="blue" onClick={this.handleCreateOrg}>
                Create and Join
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createJoinOrganisation: organisationInfo => {
      dispatch(createJoinOrganisation(organisationInfo));
    }
  };
};

export default connect(null, mapDispatchToProps)(CreateOrganisationForm);
