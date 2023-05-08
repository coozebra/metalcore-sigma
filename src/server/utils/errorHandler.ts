export const errorHandler = (error, req, res, next) => {
  const authUrls = ['/api/v1/users/login', '/api/v1/users/register'];
  const status = error?.status ?? 500;

  if (authUrls.some(authUrl => req.url?.startsWith(authUrl))) {
    const content = error?.response?.data ?? error?.message;

    return res.status(status).send({ errors: [{ detail: content }] });
  }

  return res.status(status).send(error);
};
