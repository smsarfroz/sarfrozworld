export default function getErrorMessage(status) {
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 403:
      return 'Forbidden. You do not have permission.';
    case 404:
      return 'Resource not found.';
    case 409:
      return 'Conflict. The resource may already exist.';
    case 500:
      return 'Internal server error. Please try again later.';
    default:
      return `Something went wrong (Error ${status}).`;
  }
}
