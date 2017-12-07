import axios from 'axios';
import { Message } from 'tinper-bee';

const serveUrl = {
  apply:'/invitecode/web/v1/poolcode/apply'
}

/**
 * 
 * @param {*} param  
 * 
 */
export function apply(param) {
  let url2 = serveUrl.apply;
  return axios.post(url2, param)

}


