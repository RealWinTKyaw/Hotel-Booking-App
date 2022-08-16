// use Axios for HTTP requests and Local Storage for user information & JWT
import axios from "axios";
const API_URL = "http://localhost:8080/api/auth/";
class AuthService {
  login(username, password) { // POST {username,password} & save JWT to Loacl Storage
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user"); // remove JWT from Local Storage
  }
  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    }); // POST {username, email , password}
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  } // get stored user informnation (including JWT)
}
export default new AuthService();