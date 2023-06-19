const host = 'http://localhost:4000';

export const config = {
  registerRoute: `${host}/api/auth/register`,
  loginRoute: `${host}/api/auth/login`,
  profileRoute: `${host}/api/auth/profile`,
  getAllContacts: `${host}/api/auth/allUsers`,
  sendMessageRoutes: `${host}/api/messages/addmsg`,
  getAllMessagesRoutes: `${host}/api/messages/getmsg`,
};
