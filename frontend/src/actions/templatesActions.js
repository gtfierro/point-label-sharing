import axios from 'axios';

import {
    CREATE_TEMPLATE,
    GET_TEMPLATE,
    GET_ALL_TEMPLATES
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllTemplates = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/template`);

    console.log(res.data);

    dispatch({
        type: GET_ALL_TEMPLATES,
        payload: {
            templateIds: res.data,
            response: ""
        }
    });
};

export const getTemplate = ({ templateId }) => async (dispatch) => {
    const res = await axios.get(`${ROOT_URL}/template/${templateId}`);

    console.log(res.data);

    dispatch({
        type: GET_TEMPLATE,
        payload: {
            template: res.data,
            response: ""
        }
    });
};

export const createTemplate = ({ templateId }) => async (dispatch) => {
    const res = await axios.post(`${ROOT_URL}/rule/${templateId}`, );

    console.log(res.data);

    dispatch({
        type: CREATE_TEMPLATE,
        payload: {
            response: res.data
        }
    });
};