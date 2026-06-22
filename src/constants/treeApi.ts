import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './api';

export const treeApi = {
    getMyTree: () => {
        return axiosClient.get(API_ENDPOINTS.myTree);
    },
    waterTree: () => {
        return axiosClient.post(API_ENDPOINTS.waterTree);
    },
    getHistory: () => {
        return axiosClient.get(API_ENDPOINTS.treeHistory);
    }
};
