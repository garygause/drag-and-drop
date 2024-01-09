export interface Validatable {
  value: string | number | boolean;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(input: Validatable): boolean {
  if (input.required) {
    if (input.value.toString().trim().length === 0) {
      return false;
    }
  }

  if (input.minLength && typeof input.value === 'string') {
    if (input.value.trim().length < input.minLength) {
      return false;
    }
  }

  if (input.maxLength && typeof input.value === 'string') {
    if (input.value.trim().length > input.maxLength) {
      return false;
    }
  }

  if (input.min && typeof input.value === 'number') {
    if (input.value < input.min) {
      return false;
    }
  }

  if (input.max && typeof input.value === 'number') {
    if (input.value > input.max) {
      return false;
    }
  }
  return true;
}
