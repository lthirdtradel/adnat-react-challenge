import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../store/actions/authActions";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";
import Logo from "../../images/logo.png";
export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    };
  }
  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleRegister = event => {
    event.preventDefault();
    this.props.register(this.state);
  };

  render() {
    if (this.props.user) {
      return <Redirect to="/home" />;
    }
    return (
      <Grid
        component="main"
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            <Image src={Logo} /> Log-in to your account
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Name"
                id="name"
                onChange={this.handleInputChange}
              />
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                id="email"
                placeholder="E-mail address"
                onChange={this.handleInputChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                id="password"
                onChange={this.handleInputChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password Confirmation"
                type="password"
                id="passwordConfirmation"
                onChange={this.handleInputChange}
              />
              <Button
                color="blue"
                fluid
                size="large"
                onClick={this.handleRegister}
              >
                Register
              </Button>
            </Segment>
          </Form>
          <Message>
            Already have an account? <Link to="/login">Sign In</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.sessionToken ? true : false
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: userInfo => {
      dispatch(register(userInfo));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
