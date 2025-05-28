import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 30,
  duration: '10s',
};

export default function() {
  const apiKey = 'silvia-Von-Iliade'
  
  const params = {
    headers: {
      'X-API-Key': apiKey,
    },
  };
  
  let res = http.get('http://202.10.47.102:4000/api/room', params);
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
