import { Song } from "../hook/song/useAllSongs";
import api from "./axiosCustom";
import { appUrls } from "./contants";

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface User {
  email: string;
  username: string;
  phone: string;
  registerDate: Date;
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
  favoriteSongs?: Song[]
}
export interface UpdateProfileDTO {
  username: string;
}

export interface SignUpDTO {
  email: string;
  username: string;
  password: string;
}
export interface SignInDTO {
  email: string;
  password: string;
}
export const getProfileInfo = async (): Promise<User> => {
  const response = await api.get(`${appUrls.backendUrl}/profile`);
  return response.data;
};

export const getToken = async (): Promise<string> => {
  return localStorage.getItem("token") as string;
};

export const getAllUser = async (): Promise<User[]> => {
  const response = await api.get(`${appUrls.backendUrl}/public/users`);
  return response.data;
};

export const updateUserProfile = async (body: UpdateProfileDTO) => {
  const response = await api.put(`${appUrls.backendUrl}/user/profile`, body);
  return response.data;
};

export const updateImageProfile = async (body: FormData): Promise<string> => {
  const response = await api.patch(
    `${appUrls.backendUrl}/update-avatar`,
    body,
    {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const register = async (body: SignUpDTO) => {
  const response = await api.post(`${appUrls.backendUrl}/auth/register`, body);
  return response.data;
};

export const login = async (body: SignInDTO) => {
  const response = await api.post(`${appUrls.backendUrl}/auth/login`, body);
  return response.data;
};

export interface User{
  _id: string;
  username: string;
  email: string;
  phone: string;
  registerDate: Date;
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
}