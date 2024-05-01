export class LateCheckinValidationError extends Error {
  constructor() {
    super(
      'The cjheck in can only be validated until 20 minutes of its creations.',
    )
  }
}
