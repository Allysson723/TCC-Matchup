import {UpdateUserPayload, User} from "../../model/user";
import axios, {AxiosResponse} from "axios";

const API_BASE_URL = 'http://localhost:8080/api/';

export const updateUserData = async (user: UpdateUserPayload): Promise<User> => {
    try {
        let response: AxiosResponse<User, any>;
        response = await axios.put<User>(`${API_BASE_URL}update/user`, user, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        /*setUser();*/
        throw error;
    }

};