import axios from 'axios';
import {
    GET_FILE,
    GET_ALL_FILE_IDS,
    GET_ALL_FILES,
    CREATE_FILE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllFileIds = () => async (dispatch, getState) => {
    const res = await axios.get(` ${ROOT_URL}/file`);

    console.log(res.data);

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

    console.log(res.data);

    let files = {};

    if (res.data) {
        for (const id of res.data) {
            const file = await axios.get(`${ROOT_URL}/file/${id}`);
            
            files[id] = file.data;
        }
    }

    console.log(files);

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

    console.log(res.data);

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
    const headers = {
            'Access-Control-Allow-Origin': "*",
            'Content-Type': 'application/json',
    };

    const res = await axios.post(`${ROOT_URL}/file`, fileContents, {
        headers
    });

    console.log(res.data);

    dispatch({
        type: CREATE_FILE,
        payload: {
            response: res.data
        }
    });

    return Promise.resolve(getState());
};