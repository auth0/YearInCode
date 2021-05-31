import util from 'util'

const promisify = util.promisify || require('es6-promisify').promisify

export function invoke(handler: Function, event = {}, context = {}) {
  return promisify(handler)(event, context)
}
