import {createContext, useEffect, useState} from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    authReady: false
});

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const[token, setToken] = useState(null);

    useEffect(() => {
        netlifyIdentity.on('login', (user) => {
            setUser(user)
            setToken(user.token);
            netlifyIdentity.close()
            console.log('login event')
            console.log(user);
        })

        netlifyIdentity.on('logout', (user) => {
            setUser(null);
            netlifyIdentity.close();
            console.log('logout event');
            console.log(user);
        })

                //init netlify identity connection
                netlifyIdentity.init()

        return () => {
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
        }
        
    }, [])

    const login = () => {
        netlifyIdentity.open()
    }

    const logout = () => {
        netlifyIdentity.logout()
    }

    const context = {user, login, logout, token}
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;