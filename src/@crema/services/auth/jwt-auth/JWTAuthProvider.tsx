import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUserType } from "@crema/types/models/AuthUser";
import jwtAxios, { setAuthToken } from "./index";
import { useInfoViewActionsContext } from "@crema/context/AppContextProvider/InfoViewContextProvider";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./tokenKeys";

interface JWTAuthContextProps {
  user: AuthUserType | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignInProps {
  email: string;
  password: string;
}

interface JWTAuthActionsProps {
  signInUser: (data: SignInProps) => void;
  logout: () => void;
  refreshUser: () => void;
}

const JWTAuthContext = createContext<JWTAuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});
const JWTAuthActionsContext = createContext<JWTAuthActionsProps>({
  signInUser: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export const useJWTAuth = () => useContext(JWTAuthContext);

export const useJWTAuthActions = () => useContext(JWTAuthActionsContext);

interface JWTAuthAuthProviderProps {
  children: ReactNode;
}

const JWTAuthAuthProvider: React.FC<JWTAuthAuthProviderProps> = ({
  children,
}) => {
  const [jwtAuthData, setJWTAuthData] = useState<JWTAuthContextProps>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const infoViewActionsContext = useInfoViewActionsContext();

  useEffect(() => {
    const getAuthUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!token) {
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }
      setAuthToken(token);
      try {
        const { data: body } = await jwtAxios.get("/partner/auth/me");
        setJWTAuthData({
          user: body.data,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAuthToken();
        setJWTAuthData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getAuthUser();
  }, []);

  const signInUser = async ({ email, password }: SignInProps) => {
    infoViewActionsContext.fetchStart();
    try {
      const { data: body } = await jwtAxios.post("/partner/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken, user } = body.data;
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setAuthToken(accessToken);
      setJWTAuthData({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      infoViewActionsContext.fetchSuccess();
    } catch (error: any) {
      setJWTAuthData({
        ...jwtAuthData,
        isAuthenticated: false,
        isLoading: false,
      });
      infoViewActionsContext.fetchError(
        error?.response?.data?.message || "Đăng nhập thất bại",
      );
    }
  };

  const refreshUser = async () => {
    try {
      const { data: body } = await jwtAxios.get("/partner/auth/me");
      setJWTAuthData((prev) => ({
        ...prev,
        user: body.data,
      }));
    } catch (error) {
      // ignore — the periodic /me check on next mount/refresh will catch real auth failures
    }
  };

  const logout = async () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAuthToken();
    setJWTAuthData({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <JWTAuthContext.Provider
      value={{
        ...jwtAuthData,
      }}
    >
      <JWTAuthActionsContext.Provider
        value={{
          signInUser,
          logout,
          refreshUser,
        }}
      >
        {children}
      </JWTAuthActionsContext.Provider>
    </JWTAuthContext.Provider>
  );
};
export default JWTAuthAuthProvider;
