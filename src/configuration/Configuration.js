class Configuration {
  BASE_URL = "http://192.168.86.89:8080/backoffice-service";
  TPLINK_BASE = this.BASE_URL + "/rest/services/tplink";
  TPLINK_ACCOUNT = this.TPLINK_BASE + "/account";
  TPLINK_DEVICES = this.TPLINK_BASE + "/{accountId}/devices";
  TPLINK_DEVICE_STATES = this.TPLINK_BASE + "/{accountId}/device/{id}/stats/{period}";
}

export default Configuration;