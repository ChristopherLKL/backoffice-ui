import React from "react";

import Configuration from "../configuration/Configuration.js";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Row,
  Col
} from "reactstrap";

import { Switch } from '@material-ui/core';

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      devices: []
    };
    this.config = new Configuration();
    this.handleChange = this.handleChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    fetch(this.config.TPLINK_ACCOUNT)
      .then((result) => result.json())
      .then((account) => {
        fetch(this.config.TPLINK_DEVICES.replaceAll("{accountId}", account.accountId))
          .then((result) => result.json())
          .then((json) => {
            this.setState({
              account: account,
              devices: json
            });
          });
      });
  }

  handleChange(deviceId, e) {
    let value=e.target.value;
      fetch(this.config.TPLINK_DEVICE_STATE.replaceAll("{accountId}", this.state.account.accountId).replaceAll("{id}", deviceId).replaceAll("{state}", (value === "1" ? "OFF" : "ON")), {
        method: "put"
      })
      .then((result) => {
        fetch(this.config.TPLINK_DEVICES.replaceAll("{accountId}", this.state.account.accountId))
          .then((res) => res.json())
          .then((json) => {
            this.setState({
              devices: json
            });
          });
      });
  }

  render() {
    return (
      <>
        {this.state.devices &&
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <h4 className="title">TP Link Devices</h4>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Alias</th>
                        <th>Hardware version</th>
                        <th>MAC Address</th>
                        <th>Model</th>
                        <th>Name</th>
                        <th>Region</th>
                        <th>Type</th>
                        <th>Firmware version</th>
                        <th>Relay State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.devices && this.state.devices.filter((device) => device.deviceState !== null).map((device) => {
                          return (
                            <tr key={device.deviceId}>
                              <td>{device.alias}</td>
                              <td>{device.deviceHwVer}</td>
                              <td>{device.deviceMac}</td>
                              <td>{device.deviceModel}</td>
                              <td>{device.deviceName}</td>
                              <td>{device.deviceRegion}</td>
                              <td>{device.deviceType}</td>
                              <td>{device.fwVer}</td>
                              <td><Switch onChange={(e) => this.handleChange(device.deviceId, e)} checked={device.deviceState !== undefined && device.deviceState.system.get_sysinfo.relay_state==="1" ? true : false} value={device.deviceState.system.get_sysinfo.relay_state} /></td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>}
      </>
    );
  }
}

export default Tables;
