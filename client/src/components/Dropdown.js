import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Ddown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <Dropdown direction= "left" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret color="success">
          Event type
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>Event</DropdownItem>
          <DropdownItem>Session</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default Ddown;
