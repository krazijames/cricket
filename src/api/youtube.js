import * as config from '@cricket/config';
import { create } from 'apisauce';

const api = create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
});

api.addRequestTransform((request) => {
  switch (request.method) {
    case 'get':
    case 'head':
    case 'delete':
    case 'link':
    case 'unlink':
      request.params = {
        key: config.google.API_KEY,
        ...request.params,
      };
      break;
    case 'post':
    case 'put':
    case 'patch':
      request.data = {
        key: config.google.API_KEY,
        ...request.data,
      };
      break;
    default:
      break;
  }
});

api.addResponseTransform((response) => {
  if (!response.ok) {
    throw response;
  }
});

export default api;
