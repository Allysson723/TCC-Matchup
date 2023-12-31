import axios, {AxiosResponse} from 'axios';
import {InterestDependency, InterestDto} from "../../model/interest";

interface JsonObject {
    [key: string]: any;
}

const API_BASE_URL = 'http://localhost:8080/api/interests/';

export const registerAll = async (type: string, jsonObject: JsonObject) => {
    console.log(jsonObject);
    try {
        const response: AxiosResponse<InterestDependency> = await axios.post(`${API_BASE_URL}register/${type}`, jsonObject);
        return response.data;
    } catch (error) {
        alert(`An error occurred in register(): ${error}`);
    }
}

export const registerInterest = async (interest: InterestDto) => {
    try {
        const response: AxiosResponse<InterestDependency> = await axios.post(`${API_BASE_URL}register/interest`, interest,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`An error occurred in register(): ${error}`);
    }
}

export const registerInterestDependency = async (type: string, name: string) => {

    if (!name || !type) return;

    return registerAll(type, {name: name});

}

export const getAll = async (type: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${type}/all`);
        return response.data;
    } catch (error) {
        throw new Error(`Error getting ${type}s: ${error}`);
    }
};

export const getAllInterestDependencies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}get-all-dependencies`);
        return response.data;
    } catch (error) {
        throw new Error(`Error getting dependencies`);
    }
};
