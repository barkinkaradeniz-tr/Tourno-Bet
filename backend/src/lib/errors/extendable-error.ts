interface ErrorOptions {
  statusCode?: number
  payload?: any
}

class ExtendableError extends Error {
  statusCode: number
  payload: any

  constructor(message: string, { statusCode, payload }: ErrorOptions = {}) {
    super(message)

    this.name = this.constructor.name
    this.message = message
    this.statusCode = statusCode || 400
    this.payload = payload || {}
  }

  toJSON() {
    return {
      message: this.message,
      error: this.name,
      statusCode: this.statusCode,
      payload: this.payload,
    }
  }
}

export default ExtendableError
