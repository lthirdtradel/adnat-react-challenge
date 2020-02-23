import React, { Component } from "react";
import { Container, Dropdown, Image, Menu } from "semantic-ui-react";
import Logo from "../../images/logo.png";
import { connect } from "react-redux";
import { logOut } from "../../store/actions/authActions";

export class NavBar extends Component {
  handleLogOut = () => {
    this.props.logOut();
  };

  render() {
    return (
      <Menu fixed="top" inverted color="blue">
        <Container>
          <Menu.Item as="a" header position="left">
            <Image size="mini" src={Logo} style={{ marginRight: "1.5em" }} />
            Adnat
          </Menu.Item>
          <Dropdown item simple text={this.props.name} position="right">
            <Dropdown.Menu>
              <Dropdown.Item onClick={this.handleLogOut}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
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
    logOut: () => {
      dispatch(logOut());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
