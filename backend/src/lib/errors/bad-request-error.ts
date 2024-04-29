import ExtendableError from './extendable-error'

class BadRequestError extends ExtendableError {
  constructor(message?: string) {
    super(message || 'Bad request', { statusCode: 400 })
  }
}

export default BadRequestError
