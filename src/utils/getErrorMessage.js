const getErrorMessage = (status) => {
    const messages = {
        400: "Invalid request. Please check your data.",
        401: "Please log in to continue.",
        404: "The resource was not found.",
        500: "Server error. We're working on it!"
    };
    return messages[status] || "An unexpected error occurred. Please try again.";
};

export default getErrorMessage