import axios from 'axios';
import {
    GET_RULE,
    GET_ALL_RULES,
    APPLY_RULE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllRules = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/rule`);

    console.log(res.data);

    dispatch({
        type: GET_ALL_RULES,
        payload: {
            ruleIds: res.data,
            response: ""
        }
    });
};

export const getRule = ({ ruleId }) => async (dispatch) => {
    const res = await axios.get(`${ROOT_URL}/rule/${ruleId}`);

    console.log(res.data);

    dispatch({
        type: GET_RULE,
        payload: {
            rule: res.data,
            response: ""
        }
    });
};

export const applyRule = ({ fileId, ruleId }) => async (dispatch) => {
    const res = await axios.post(`${ROOT_URL}/${fileId}/${ruleId}`);

    console.log(res.data);

    dispatch({
        type: APPLY_RULE,
        payload: {
            response: res.data
        }
    });
};