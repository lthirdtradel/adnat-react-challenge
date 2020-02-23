import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logIn } from "../../store/actions/authActions";
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

export class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleLogIn = event => {
    event.preventDefault();
    this.props.logIn(this.state);
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
                placeholder="E-mail address"
                id="email"
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

              <Button
                color="blue"
                fluid
                size="large"
                type="submit"
                onClick={this.handleLogIn}
              >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <Link to="/register">Register</Link>
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
    logIn: credentials => {
      dispatch(logIn(credentials));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
