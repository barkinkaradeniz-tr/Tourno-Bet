import ExtendableError from './extendable-error'

class NotFoundError extends ExtendableError {
  constructor(message?: string) {
    super(message || 'Not found', { statusCode: 404 })
  }
}

export default NotFoundError
