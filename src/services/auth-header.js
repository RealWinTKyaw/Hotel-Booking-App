// retrieve data from server
// in case we access protected resources, the HTTP request needs Authorization header

// check Local Storage for user item
export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) { //if there is a logged un user with accessToken (JWT), return HTTP Authorization header
      return { 'x-access-token': user.accessToken };
    } else { // otherwise return an empty object
      return {};
    }
  }

