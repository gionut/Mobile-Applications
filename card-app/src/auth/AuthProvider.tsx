import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {loginAPI} from "./authAPI";

type LoginFn = (username?: string, password?: string) => void;

export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    pendingAuthentication?: boolean;
    username?: string;
    password?: string;
    token: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    token: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    console.log("AuthProvider");

    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated, isAuthenticating, authenticationError, pendingAuthentication, token } = state;

    const login = useCallback<LoginFn>(loginCallback, []);
    useEffect(authenticationEffect, [pendingAuthentication]);

    const value = { isAuthenticated, login, isAuthenticating, authenticationError, token };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(username?: string, password?: string): void {
        console.log("loginCallback");
        setState({
            ...state,
            pendingAuthentication: true,
            username,
            password,
        });
    }

    function authenticationEffect() {
        console.log(`authenticationEffect: pendingAuthentication has changed to ${pendingAuthentication}`)
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            console.log("authenticate")
            if (!pendingAuthentication) {
                return;
            }
            try {
                setState({
                    ...state,
                    isAuthenticating: true,
                });
                const { username, password } = state;
                const token =  await loginAPI(username, password);
                if (canceled) {
                    return;
                }
                setState({
                    ...state,
                    token: token,
                    pendingAuthentication: false,
                    isAuthenticated: true,
                    isAuthenticating: false,
                });
            } catch (error) {
                if (canceled) {
                    return;
                }
                  if(error instanceof Error)
                      setState({
                    ...state,
                    authenticationError: error,
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
            }
        }
    }
};