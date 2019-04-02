import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Chart from './Chart';


class SeshModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>More Info</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Useful Information</ModalHeader>
          <ModalBody>
          <Chart/>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Return to Map</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SeshModal;
