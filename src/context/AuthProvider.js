import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const[auth,setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth}}>
            {/* components nested inside the auth provider */}
            {children}
            
        </AuthContext.Provider>
    )
}

export default AuthContext;