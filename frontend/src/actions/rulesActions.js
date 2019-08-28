import axios from 'axios';
import {
    GET_RULE,
    GET_ALL_RULE_IDS,
    GET_ALL_RULES,
    CREATE_RULE,
    APPLY_RULE
} from './types';

const ROOT_URL = "http://localhost:5000";

export const getAllRuleIds = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/rule`);

    console.log(res.data);

    dispatch({
        type: GET_ALL_RULE_IDS,
        payload: {
            ruleIds: res.data,
            response: res.statusText
        }
    });
};

export const getAllRules = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/rule`);

    console.log(res.data);

    let rules = [];

    if (res.data) {
        for (const id of res.data) {
            const rule = await axios.get(` ${ROOT_URL}/rule/${id}`);
            
            rules.push(rule.data);
        }
    }

    dispatch({
        type: GET_ALL_RULES,
        payload: {
            rules,
            response: res.statusText
        }
    });
}


export const getRule = ({ ruleId }) => async (dispatch) => {
    const res = await axios.get(`${ROOT_URL}/rule/${ruleId}`);

    console.log(res.data);

    dispatch({
        type: GET_RULE,
        payload: {
            rules: [res.data],
            response: ""
        }
    });
};

export const createRule = ({ templateId, data }) => async (dispatch, getState) => {
    const res = await axios.post(`${ROOT_URL}/rule/${templateId}`, data);

    console.log(res.data);

    dispatch({
        type: CREATE_RULE,
        payload: {
            response: res.data
        }
    });

    return Promise.resolve(getState());
};

export const applyRule = ({ fileId, ruleId }) => async (dispatch, getState) => {
    const res = await axios.post(`${ROOT_URL}/apply/${fileId}/${ruleId}`);

    console.log(res.data);

    dispatch({
        type: APPLY_RULE,
        payload: {
            response: res.data
        }
    });

    return Promise.resolve(getState());
};

export const applyMultipleRules = ({ fileId, ruleIds }) => async (dispatch, getState) => {
    for (const ruleId of ruleIds) {
        const res = await axios.post(`${ROOT_URL}/apply/${fileId}/${ruleId}`);

        dispatch({
            type: APPLY_RULE,
            payload: {
                response: res.data
            }
        });
    }

    return Promise.resolve(getState());
};