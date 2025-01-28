import axios from 'axios';

const gateWebUrl = `${import.meta.env.REACT_APP_GATEWAY_URL}`;

const apiServer = axios.create({
  baseURL: gateWebUrl,
});

export default apiServer;
