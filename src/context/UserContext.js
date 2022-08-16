import { Component, createContext } from "react";
import api from "../services/api";
const UserContext = createContext();

export default class UserProvider extends Component {
    state = {
        isLoggedIn: false,
        user: {
            info:{
                username:undefined
            }},

        logIn: async (newUser) => {
          // const enc_user = encrypt(newUser)
            const user = await api.getUser(newUser)
            this.setState({isLoggedIn: true, user: await user})
        },
        logOut: () => {
            this.setState({isLoggedIn: false, user: {info:{
                username:undefined
            }}}) 
        },
        updateUser: async (newUser) => {
          const user = await newUser
          if (user.uid === this.state.user.uid) {
            this.stateState({user: user})
          }
        },
        deleteUser: () => {
            api.deleteUser(this.state.user.uid)
            this.state.logOut()
        },
        updateBookings: async () => {
            const user = await api.getBookings(this.state.user)
            this.setState({isLoggedIn: true, user: await user})
        },
    };

    render() { // Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.
        return (
            // value prop to be passed to consuming components that are descendants of this Provider.
            // use this.state to lift the value to the parent state to prevent unintentional renders in consumers when a provider's parent re-renders
            // pass down state information to the value
        <UserContext.Provider 
        value={{...this.state}}> 
                {/* All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes. */}
                {/* ensuring that children components are being accessed */}
            {this.props.children}
        </UserContext.Provider>
        );
    }
}


const UserConsumer = UserContext.Consumer;

export { UserProvider, UserConsumer, UserContext} // room provider wraps the whole app in index.js

export function withUserConsumer(Component) {
    return function ConsumerWrapper(props) {
      return ( // A React component that subscribes to context changes. Using this component lets you subscribe to a context within a function component
        <UserConsumer> 
          {/* The value argument passed to the function will be equal to the value prop of the closest Provider for this context above in the tree. */}
          {value => <Component {...props} context={value} />}
        </UserConsumer>
      );
    };
  }
// wrap router and app in the component tree
// allows you to avoid the step of passing data from one page to another
