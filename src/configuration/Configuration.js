class Configuration {
  BASE_URL = "http://localhost:8888/backoffice-service";
  TPLINK_BASE = this.BASE_URL + "/rest/services/tplink";
  TPLINK_ACCOUNT = this.TPLINK_BASE + "/account";
  TPLINK_DEVICES = this.TPLINK_BASE + "/{accountId}/devices";
  TPLINK_DEVICE_STATES = this.TPLINK_BASE + "/{accountId}/device/{id}/stats/{period}";
  TPLINK_DEVICES_STATE = this.TPLINK_BASE + "/{accountId}/devices/state";
  TPLINK_DEVICE_STATE = this.TPLINK_BASE + "/{accountId}/device/{id}/state/{state}";
}

export default Configuration;
