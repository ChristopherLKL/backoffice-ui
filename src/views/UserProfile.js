import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

import Configuration from "../configuration/Configuration.js";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        account: null
    };
    this.config = new Configuration();
  }

  UNSAFE_componentWillMount() {
    fetch(this.config.TPLINK_ACCOUNT)
      .then((result) => result.json())
      .then((json) => this.setState({account: json}));
  }

  render() {
    return (
      <>
        {this.state.account && 
        <div className="content">
          <Row>
            <Col md="8">
              <Card>
                <CardHeader>
                  <h5 className="title">TP Link Profile</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1" md="2">
                        <FormGroup>
                          <label>Account ID</label>
                          <Input
                            disabled
                            placeholder="accountId"
                            type="text"
                            value={this.state.account.accountId}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="5">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input disabled placeholder="example@email.com" type="email" value={this.state.account.email} />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="4">
                        <FormGroup>
                          <label>
                            Register date
                          </label>
                          <Input disabled placeholder="YYYY-MM-DD HH:mm:ss" type="text" value={this.state.account.regTime} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="2">
                        <FormGroup>
                          <label>Country Code</label>
                          <Input disabled
                            placeholder="XX"
                            type="text"
                            value={this.state.account.countryCode}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="9">
                        <FormGroup>
                          <label>Token</label>
                          <Input disabled
                            placeholder="token"
                            type="text"
                            value={this.state.account.token}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar"
                        src={require("assets/img/chris_avatar.jpg")}
                      />
                      <h5 className="title">Christopher Lee</h5>
                    </a>
                    <p className="description">Senior Software Engineer</p>
                  </div>
                  <div className="card-description">
                    I love Fitness classes, High-Tech, video games, travelling, Sci-Fi, programming, TMNT,...
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="button-container">
                    <Button className="btn-icon btn-round" color="facebook">
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button className="btn-icon btn-round" color="twitter">
                      <i className="fab fa-twitter" />
                    </Button>
                    <Button className="btn-icon btn-round" color="google">
                      <i className="fab fa-google-plus" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>}
      </>
    );
  }
}

export default UserProfile;
