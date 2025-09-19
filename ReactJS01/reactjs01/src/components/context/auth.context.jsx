import { createContext, useState, useEffect } from 'react';
import { getUserApi } from '../../util/api';

export const AuthContext = createContext({
    auth: {
        isAuthenticated: false,
        user: {
            email: "",
            name: "",
        },
    },
    setAuth: () => { },
    appLoading: true,
    setAppLoading: () => { },
    refreshProducts: 0,
    setRefreshProducts: () => { },
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: "",
        },
    });
    const [appLoading, setAppLoading] = useState(true);
    const [refreshProducts, setRefreshProducts] = useState(0);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await getUserApi();
                    if (response.EC === 0 && response.data) {
                        setAuth({
                            isAuthenticated: true,
                            user: {
                                email: response.data.email,
                                name: response.data.name,
                            },
                        });
                    } else {
                        localStorage.removeItem('access_token');
                        setAuth({
                            isAuthenticated: false,
                            user: { email: "", name: "" },
                        });
                    }
                } catch (error) {
                    console.error('Error checking auth:', error);
                    localStorage.removeItem('access_token');
                    setAuth({
                        isAuthenticated: false,
                        user: { email: "", name: "" },
                    });
                }
            }
            setAppLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading, refreshProducts, setRefreshProducts }}>
            {props.children}
        </AuthContext.Provider>
    );
};
