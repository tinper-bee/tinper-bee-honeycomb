/**
 * 公用提示
 * @auth zby
 */

import { Message } from 'tinper-bee';

export function err(msg) {
  return Message.create({
    content: msg,
    color: 'danger',
    duration: null
  })
}

export function warn(msg) {
  return Message.create({
    content: msg,
    color: 'warning',
    duration: 4.5
  })
}

export function success(msg) {
  return Message.create({
    content: msg,
    color: 'success',
    duration: 1.5
  })
}
