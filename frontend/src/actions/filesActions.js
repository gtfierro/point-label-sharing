import axios from 'axios';
import {
    GET_FILE,
    GET_ALL_FILE_IDS,
    GET_ALL_FILES,
    CREATE_FILE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllFileIds = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/file`);

    console.log(res.data);

    dispatch({
        type: GET_ALL_FILE_IDS,
        payload: {
            fileIds: res.data,
            response: res.statusText
        }
    });
};

export const getAllFiles = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/file`);

    console.log(res.data);

    let files = [];

    if (res.data) {
        res.data.forEach(async id => {
            const file = await axios.get(` ${ROOT_URL}/file/${id}`);
            
            files.push(file.data);
        });
    }

    dispatch({
        type: GET_ALL_FILES,
        payload: {
            files,
            response: res.statusText
        }
    });
}

export const getFile = ({ fileId }) => async (dispatch) => {
    const res = await axios.get(`${ROOT_URL}/file/${fileId}`);

    console.log(res.data);

    dispatch({
        type: GET_FILE,
        payload: {
            files: [res.data],
            response: res.statusText
        }
    });
};

export const createFile = ({ fileContents }) => async (dispatch) => {
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
};