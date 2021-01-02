import React from "react";
// react plugin used to create charts
import { Line, Doughnut } from "react-chartjs-2";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

// core components
import {
  lineChart,
  donutChart
} from "variables/charts.js";

import Configuration from "../configuration/Configuration.js";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartFilter: "day",
      account: null,
      devices: [],
      dayStatesPerDevice: [],
      donutCurrentLabels: [],
      donutCurrentPowerData: [],
      donutCurrentTotalData: []
    };
    this.timer = null;
    this.config = new Configuration();
    this.buildLine = this.buildLine.bind(this);
    this.buildDonut = this.buildDonut.bind(this);
    this.setChartFilter = this.setChartFilter.bind(this);
    this.initCharts = this.initCharts.bind(this); 
    this.updateCharts = this.updateCharts.bind(this); 
  }

  initCharts() {
    fetch(this.config.TPLINK_ACCOUNT)
      .then((result) => result.json())
      .then((account) => {
        this.setState({account: account});
        fetch(this.config.TPLINK_DEVICES_STATE.replaceAll("{accountId}", account.accountId))
          .then((result) => result.json())
          .then((states) => {
            states.forEach((state) => {
              this.state.donutCurrentLabels.push(state.system.get_sysinfo.alias);
              this.state.donutCurrentPowerData.push(state.emeter.get_realtime.power);
              this.state.donutCurrentTotalData.push(state.emeter.get_realtime.total);
            });
          });
        fetch(this.config.TPLINK_DEVICES.replaceAll("{accountId}", account.accountId))
          .then((result) => result.json())
          .then((devices) => {
            this.setState({devices: devices});
            devices.forEach((device) => {
              let deviceObj = {
                device: device,
                // deviceStates: [],
                labels: [],
                data: []
              };
              fetch(this.config.TPLINK_DEVICE_STATES.replaceAll("{accountId}", account.accountId).replaceAll("{id}", device.deviceId).replaceAll("{period}", "DAY"))
                .then((result) => result.json())
                .then((states) => {
                  // deviceObj.deviceStates = states;
                  deviceObj.labels = states.map((state) => {
                    let startTime = state.emeter.get_realtime.startTimeStr;
                    return startTime.substring(0, startTime.lastIndexOf(".")).split(" ")[1];
                  });
                  deviceObj.data = states.map((state) => state.emeter.get_realtime.power);
                  this.state.dayStatesPerDevice.push(deviceObj);
                  this.setChartFilter("day");
                });
            });
          });
      });
  }

  updateCharts() {
    let donutCurrentLabels = [], donutCurrentPowerData = [], donutCurrentTotalData = [];
    fetch(this.config.TPLINK_DEVICES_STATE.replaceAll("{accountId}", this.state.account.accountId))
      .then((result) => result.json())
      .then((states) => {
        states.forEach((state) => {
          donutCurrentLabels.push(state.system.get_sysinfo.alias);
          donutCurrentPowerData.push(state.emeter.get_realtime.power);
          donutCurrentTotalData.push(state.emeter.get_realtime.total);
        });
        this.setState({donutCurrentLabels: donutCurrentLabels, donutCurrentPowerData: donutCurrentPowerData, donutCurrentTotalData: donutCurrentTotalData});
      });
//    let dayStatesPerDevice = [];
//    this.state.devices.forEach((device) => {
//      let deviceObj = {
//        device: device,
//        labels: [],
//        data: []
//      };
//      fetch(this.config.TPLINK_DEVICE_STATES.replaceAll("{accountId}", this.state.account.accountId).replaceAll("{id}", device.deviceId).replaceAll("{period}", "DAY"))
//        .then((result) => result.json())
//        .then((states) => {
//          deviceObj.labels = states.map((state) => state.emeter.get_realtime.startTimeStr);
//          deviceObj.data = states.map((state) => state.emeter.get_realtime.power);
//          dayStatesPerDevice.push(deviceObj);
//        });
//      this.setState({dayStatesPerDevice: dayStatesPerDevice});
//    });
  }

  componentDidMount() {
    this.initCharts();
    this.timer = setInterval(() => this.updateCharts(), 10000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  buildDonut(canvas, labels, data) {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

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
          pointRadius: 0,
          data: data
        }
      ]
    };
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
          pointRadius: 0,
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
          <Row>
            <Col>
              <Card className="card-chart">
                <Row>
                  <Col className="text-left" sm="6">
                    <CardHeader>
                      <h5 className="card-category">Power usage</h5>
                      <CardTitle tag="h3">Current consumption (watt)</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Doughnut
                        data={(canvas) => this.buildDonut(canvas, this.state.donutCurrentLabels, this.state.donutCurrentPowerData)}
                        options={donutChart.options}
                      />
                    </CardBody>
                  </Col>
                  <Col className="text-left" sm="6">
                    <CardHeader>
                      <h5 className="card-category">Power usage</h5>
                      <CardTitle tag="h3">Total last 24 hours (watt per hour)</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Doughnut
                        data={(canvas) => this.buildDonut(canvas, this.state.donutCurrentLabels, this.state.donutCurrentTotalData)}
                        options={donutChart.options}
                      />
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          {this.state.dayStatesPerDevice && this.state.dayStatesPerDevice.map((deviceObj) => {
            return (
              <Row key={deviceObj.device.deviceId}>
                <Col xs="12">
                  <Card className="card-chart">
                    <CardHeader>
                      <Row>
                        <Col className="text-left" sm="6">
                          <h5 className="card-category">{deviceObj.device.deviceModel} ({deviceObj.device.fwVer})</h5>
                          <CardTitle tag="h2">{deviceObj.device.alias}</CardTitle>
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
