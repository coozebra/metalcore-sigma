interface INemesisError {
  response: {
    data: {
      errors: Array<{ detail: string }>;
    };
  };
}

export const nemesisErrorResponseToString = (error: INemesisError) =>
  error?.response?.data?.errors?.map(({ detail }) => detail).join('\n');
