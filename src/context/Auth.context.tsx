import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { createContext, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

interface ProviderProps {
  children: React.ReactNode;
}

export interface SignUpProps {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInProps {
  email: string;
  password: string;
}

export interface UpdatedData {
  name: string;
  age: number;
  bio: string;
  email: string;
  username: string;
  companyOrOrganization: string;
}

const AuthContext = createContext({
  user: undefined,
  error: undefined,
  signIn: (event: Event, credentials: SignInProps) => {
    return;
  },
  signUp: (event: Event, credentials: SignUpProps, isCompany: boolean) => {
    return;
  },
  signOut: () => {
    return;
  },
});

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState();
  const [company, setCompany] = useState();
  // Error is unknown to support every form of error this is any
  const [error, setError] = useState<any>();

  const Router = useRouter();

  useEffect(() => {
    checkIfUserLoggedIn();
    checkIfCompanyLoggedIn();
  }, []);

  // Register
  const signUp = async (event: Event, credentials: SignUpProps, isCompany: boolean) => {
    event.preventDefault();
    const { name, username, email, password, confirmPassword } = credentials;

    // Verify if password match
    if (password !== confirmPassword) {
      toast.error('The passwords did not match!');
      return null;
    }

    try {
      const res = await axios.post(
        `${process.env.hostName}/api/auth/signup`,
        { name, username, email, password, isCompany },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.error?.graphQLErrors['0']?.extensions?.response?.message) {
        const errors = res.data.error?.graphQLErrors['0']?.extensions?.response?.message;
        errors.forEach((err: string) => {
          toast.error(err);
        });
        return null;
      }

      if (res.data.error) {
        toast.error(res.data.error.message);
        return null;
      }

      toast.success(res.data.msg);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  // Sign in
  const signIn = async (event: Event, credentials: SignInProps) => {
    event.preventDefault();
    const { email, password } = credentials;

    try {
      const res = await axios.post(
        `${process.env.hostName}/api/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.error) {
        toast.error(res.data.error.message);
        setError(res.data.error.message);
        return;
      }

      const { user } = res.data;
      setUser(user);
      Router.push('/account/dashboard');
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await axios.post(`${process.env.hostName}/api/auth/logout`);
      setUser(undefined);
      Router.push('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  // Check if user is logged in
  const checkIfUserLoggedIn = async () => {
    try {
      const res = await axios.post(`${process.env.hostName}/api/auth/user`);
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      setUser(undefined);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;