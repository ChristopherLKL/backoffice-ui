import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

// core components
import {
  lineChart
} from "variables/charts.js";

import Configuration from "../configuration/Configuration.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartFilter: "day",
      account: null,
      dayStatesPerDevice: [],
      weekStatesPerDevice: [],
      monthStatesPerDevice: []
    };
    this.config = new Configuration();
    this.buildLine = this.buildLine.bind(this);
    this.setChartFilter = this.setChartFilter.bind(this);
  }

  UNSAFE_componentWillMount() {
    fetch(this.config.TPLINK_ACCOUNT)
      .then((result) => result.json())
      .then((account) => {
        this.setState({account: account});
        fetch(this.config.TPLINK_DEVICES.replaceAll("{accountId}", account.accountId))
          .then((result) => result.json())
          .then((devices) => {
            devices.forEach((device) => {
              let deviceObj = {
                device: device,
                deviceStates: [],
                labels: [],
                data: []
              };
              fetch(this.config.TPLINK_DEVICE_STATES.replaceAll("{accountId}", account.accountId).replaceAll("{id}", device.deviceId).replaceAll("{period}", "DAY"))
                .then((result) => result.json())
                .then((states) => {
                  deviceObj.deviceStates = states;
                  deviceObj.labels = states.map((state) => state.emeter.get_realtime.startTimeStr);
                  deviceObj.data = states.map((state) => state.emeter.get_realtime.power);
                  this.state.dayStatesPerDevice.push(deviceObj);
                  this.setChartFilter("day");
                });
              fetch(this.config.TPLINK_DEVICE_STATES.replaceAll("{accountId}", account.accountId).replaceAll("{id}", device.deviceId).replaceAll("{period}", "WEEK"))
                .then((result) => result.json())
                .then((states) => {
                  deviceObj.deviceStates = states;
                  deviceObj.labels = states.map((state) => state.emeter.get_realtime.startTimeStr);
                  deviceObj.data = states.map((state) => state.emeter.get_realtime.power);
                  this.state.weekStatesPerDevice.push(deviceObj);
                });
              fetch(this.config.TPLINK_DEVICE_STATES.replaceAll("{accountId}", account.accountId).replaceAll("{id}", device.deviceId).replaceAll("{period}", "MONTH"))
                .then((result) => result.json())
                .then((states) => {
                  deviceObj.deviceStates = states;
                  deviceObj.labels = states.map((state) => state.emeter.get_realtime.startTimeStr);
                  deviceObj.data = states.map((state) => state.emeter.get_realtime.power);
                  this.state.monthStatesPerDevice.push(deviceObj);
                });
            });
          });
      });
  }
  
  buildLine(canvas, chartFilter, deviceId) {
    let labels = null, data = null;
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    switch(chartFilter) {
    case "day":
      labels = this.state.dayStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.labels)[0];
      data = this.state.dayStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.data)[0];
      break;
    case "week":
      labels = this.state.weekStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.labels)[0];
      data = this.state.weekStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.data)[0];
      break;
    case "month":
      labels = this.state.monthStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.labels)[0];
      data = this.state.monthStatesPerDevice.filter((deviceObj) => deviceObj.device.deviceId === deviceId).map((deviceObj) => deviceObj.data)[0];
      break;
    default:
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Power",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: data
        }
      ]
    };
  }

  setChartFilter(name) {
    this.setState({
      chartFilter: name
    });
  };

  render() {
    return (
      <>
        <div className="content">
          {this.state.dayStatesPerDevice && this.state.dayStatesPerDevice.map((deviceObj) => {
            return (
              <Row key={deviceObj.device.deviceId}>
                <Col xs="12">
                  <Card className="card-chart">
                    <CardHeader>
                      <Row>
                        <Col className="text-left" sm="6">
                          <h5 className="card-category">Power usage</h5>
                          <CardTitle tag="h2">{deviceObj.device.alias}</CardTitle>
                        </Col>
                        <Col sm="6">
                          <ButtonGroup
                            className="btn-group-toggle float-right"
                            data-toggle="buttons"
                          >
                            <Button
                              tag="label"
                              className={classNames("btn-simple", {
                                active: this.state.chartFilter === "day"
                              })}
                              color="info"
                              id="0"
                              size="sm"
                              onClick={() => this.setChartFilter("day")}
                            >
                              <input
                                defaultChecked
                                className="d-none"
                                name="options"
                                type="radio"
                              />
                              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                Day
                              </span>
                              <span className="d-block d-sm-none">
                                <i className="tim-icons icon-single-02" />
                              </span>
                            </Button>
                            <Button
                              color="info"
                              id="1"
                              size="sm"
                              tag="label"
                              className={classNames("btn-simple", {
                                active: this.state.chartFilter === "week"
                              })}
                              onClick={() => this.setChartFilter("week")}
                            >
                              <input
                                className="d-none"
                                name="options"
                                type="radio"
                              />
                              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                Week
                              </span>
                              <span className="d-block d-sm-none">
                                <i className="tim-icons icon-gift-2" />
                              </span>
                            </Button>
                            <Button
                              color="info"
                              id="2"
                              size="sm"
                              tag="label"
                              className={classNames("btn-simple", {
                                active: this.state.chartFilter === "month"
                              })}
                              onClick={() => this.setChartFilter("month")}
                            >
                              <input
                                className="d-none"
                                name="options"
                                type="radio"
                              />
                              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                Month
                              </span>
                              <span className="d-block d-sm-none">
                                <i className="tim-icons icon-tap-02" />
                              </span>
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <div className="chart-area">
                        <Line
                          data={(canvas) => this.buildLine(canvas, this.state.chartFilter, deviceObj.device.deviceId)}
                          options={lineChart.options}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            );
          })}
        </div>
      </>
    );
  }
}

export default Dashboard;
