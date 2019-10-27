import axios from 'axios';
import {
    GET_FILE,
    GET_ALL_FILE_IDS,
    GET_ALL_FILES,
    CREATE_FILE,
    UPDATE_FILE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllFileIds = () => async (dispatch, getState) => {
    const res = await axios.get(` ${ROOT_URL}/file`);

    dispatch({
        type: GET_ALL_FILE_IDS,
        payload: {
            fileIds: res.data,
            response: res.statusText
        }
    });

    return Promise.resolve(getState());
};

export const getAllFiles = ({ appliedRules }) => async (dispatch, getState) => {
    const res = await axios.get(` ${ROOT_URL}/file?appliedRules=${appliedRules}`);

    let files = {};

    if (res.data) {
        for (const id of res.data) {
            const file = await axios.get(`${ROOT_URL}/file/${id}`);
            
            files[id] = file.data;
        }
    }

    dispatch({
        type: GET_ALL_FILES,
        payload: {
            files,
            response: res.statusText
        }
    });

    return Promise.resolve(getState());
}

export const getFile = ({ fileId }) => async (dispatch, getState) => {
    const res = await axios.get(`${ROOT_URL}/file/${fileId}`);

    dispatch({
        type: GET_FILE,
        payload: {
            file: res.data,
            response: res.statusText
        }
    });

    return Promise.resolve(getState());
};

export const createFile = ({ fileContents }) => async (dispatch, getState) => {

    const res = await axios.post(`${ROOT_URL}/file`, fileContents);

    dispatch({
        type: CREATE_FILE,
        payload: {
            response: res.data
        }
    });

    return Promise.resolve(getState());
};

export const updateFile = ({ fileId, contents }) => async (dispatch, getState) => {
    const res = await axios.put(`${ROOT_URL}/file/${fileId}`, {
        contents
    });

    dispatch({
        type: UPDATE_FILE,
        payload: {
            file: res.data,
            response: res.statusText
        }
    });

    return Promise.resolve(getState());

};