import ow from 'ow'

export function owWithMessage(val, message, validator) {
  try {
    ow(val, validator)
  } catch (error) {
    throw new Error(message)
  }
}
