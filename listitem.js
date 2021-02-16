'use strict'

module.exports = thing => {
  if (typeof thing === 'string') {
    return thing
  } else if (Array.isArray(thing)) {
    return thing[Math.floor(Math.random() * thing.length)]
  }
}