import React from 'react'
import { Rating, useRating } from 'react-feedback-stars'

/**
 * Everything available inside a ```tsx live code block. Spreading React exposes
 * the hooks (useState, etc.) directly, and Rating / useRating make the library
 * itself usable without an import statement (react-live cannot process imports).
 */
const ReactLiveScope = {
  React,
  ...React,
  Rating,
  useRating,
}

export default ReactLiveScope
