import React from "react";

import Configuration from "../configuration/Configuration.js";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      devices: []
    };
    this.config = new Configuration();
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

  render() {
    return (
      <>
        {this.state.devices &&
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">My Devices</CardTitle>
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
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.devices && this.state.devices.map((device) => {
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
                              <td>{device.status===1 ? "ON" : "OFF"}</td>
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
