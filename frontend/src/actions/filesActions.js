import axios from 'axios';
import {
    GET_FILE,
    GET_ALL_FILES,
    CREATE_FILE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllFiles = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/file`);

    console.log(res.data);
    console.log(res);

    dispatch({
        type: GET_ALL_FILES,
        payload: {
            fileIds: res.data,
            response: res.statusText
        }
    });
};

export const getFile = ({ fileId }) => async (dispatch) => {
    const res = await axios.get(`${ROOT_URL}/file/${fileId}`);

    console.log(res.data);

    dispatch({
        type: GET_FILE,
        payload: {
            file: res.data,
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