import React from 'react';
import JWTAuthAuthProvider from '@crema/services/auth/jwt-auth/JWTAuthProvider';

type AppAuthProviderProps = {
  children: React.ReactNode;
};

const AppAuthProvider = ({children}: AppAuthProviderProps) => {
  return <JWTAuthAuthProvider>{children}</JWTAuthAuthProvider>;
};

export default AppAuthProvider;
