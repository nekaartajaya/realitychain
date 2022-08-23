import 'isomorphic-fetch';
import axios from 'axios';
import NodeFormData from 'form-data';

const baseURL = process.env.REACT_APP_PINATA_API;
const JWTToken = process.env.REACT_APP_PINATA_API_JWT;
const apiKeys = process.env.REACT_APP_PINATA_API_KEY;

export const checkAuthorization = async () => {
  var config = {
    method: 'get',
    url: `${baseURL}/data/testAuthentication`,
    headers: { 
      'Authorization': `Bearer ${JWTToken}`
    }
  };
  
  const {data} = await axios(config)
  console.log(data.message);

  return data;
};

export const getList = async () => {
  var config = {
    method: 'get',
    url: `${baseURL}/users/${apiKeys}`,
    headers: { 
      'Authorization': `Bearer ${JWTToken}`
    }
  };
  const {data} = await axios(config)
  return data;
};

export const uploadFile = async (pinataApiOptions, file, cancelToken = null, onProgressFunction = null) => {
  var data = new NodeFormData();
  data.append('file', file);

  if (cancelToken == null) {
    const CancelToken = axios.CancelToken;
    cancelToken = CancelToken.source();
  }

  if (pinataApiOptions) {
    if (pinataApiOptions.pinataMetadata) {
      data.append('pinataMetadata', JSON.stringify(pinataApiOptions.pinataMetadata));
    }
    if (pinataApiOptions.pinataOptions) {
      data.append('pinataOptions', JSON.stringify(pinataApiOptions.pinataOptions));
    }
  }
  
  var config = {
    method: 'post',
    url: `${baseURL}/pinning/pinFileToIPFS`,
    // withCredentials: true,
    maxContentLength: 'Infinity',
    maxBodyLength: 'Infinity',
    headers: { 
      'Content-type': `multipart/form-data; boundary= ${data._boundary}`,
      'Authorization': `Bearer ${JWTToken}`, 
    },
    // onUploadProgress: (progressEvent) => onProgressFunction(progressEvent),
    cancelToken: cancelToken.token,
    data : data
  };
  
  const res = await axios(config);
  console.log(res.data);
}