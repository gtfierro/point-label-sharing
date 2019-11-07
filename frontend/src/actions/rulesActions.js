import axios from 'axios';
import {
    GET_RULE,
    GET_ALL_RULE_IDS,
    GET_ALL_RULES,
    GET_RULES_BY_FILE,
    CREATE_RULE,
    APPLY_RULE,
    DELETE_RULE,
    UPDATE_RULE
} from './types';

const ROOT_URL = "";

export const getAllRuleIds = () => async (dispatch) => {
    const res = await axios.get(` ${ROOT_URL}/rule`);

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

    let rules = [];

    if (res.data) {
        for (const id of res.data) {
            const rule = await axios.get(` ${ROOT_URL}/rule/${id}`);
            
            rules.push({...rule.data, "ruleid": id });

            console.log({...rule.data, "ruleid": id });
        }
    }

    dispatch({
        type: GET_ALL_RULES,
        payload: {
            rules,
            response: res.statusText
        }
    });
};

export const getRulesByFile = ({ fileId }) => async (dispatch, getState) => {
    const res = await axios.get(` ${ROOT_URL}/file/${fileId}`);

    let rules = [];

    if (res.data) {
        if (res.data.applied && res.data.applied.length > 0) {
            for (const id of res.data.applied) {
                const rule = await axios.get(` ${ROOT_URL}/rule/${id}`);
                
                rules.push({...rule.data, "ruleid": id });
    
                console.log({...rule.data, "ruleid": id });
            }
        } 
    }

    dispatch({
        type: GET_RULES_BY_FILE,
        payload: {
            rules,
            response: res.statusText
        }
    });

    return Promise.resolve(getState());
};

export const updateRule = ({ templateId, fileId, ruleId, data }) => async (dispatch, getState) => {
    const res = await axios.put(`${ROOT_URL}/rule/${ruleId}`, {
        ...data, template: templateId, fileId
    });

    let payload = {};

    if (res.data) {
        payload["fileId"] = res.data.fileid;
        payload["ruleIds"] = res.data.ruleids;
        payload["originalFile"] = res.data.originalFile;
    }

    dispatch({
        type: UPDATE_RULE,
        payload,
        response: res.statusText
    });

    return Promise.resolve(getState());

};

export const getRule = ({ ruleId }) => async (dispatch, getState) => {
    const res = await axios.get(`${ROOT_URL}/rule/${ruleId}`);

    dispatch({
        type: GET_RULE,
        payload: {
            rule: res.data,
            response: ""
        }
    });

    return Promise.resolve(getState());

};

export const createRule = ({ templateId, data }) => async (dispatch, getState) => {
    const res = await axios.post(`${ROOT_URL}/rule/${templateId}`, data);

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

    dispatch({
        type: APPLY_RULE,
        payload: {
            response: res.data
        }
    });

    return Promise.resolve(getState());
};

export const applyMultipleRules = ({ fileId, ruleIds }) => async (dispatch, getState) => {
    let newFileId = fileId;

    if (ruleIds && ruleIds.length > 0) {
        const res = await axios.post(`${ROOT_URL}/apply/${fileId}/${ruleIds[0]}`);

        if (res.data) {
            newFileId = res.data.fileid;
    
            for (const ruleId of ruleIds.slice(1)) {
                await axios.post(`${ROOT_URL}/apply/${newFileId}/${ruleId}`);
            }
    
        }    
    }
    
    dispatch({
        type: APPLY_RULE,
        payload: {
            response: {
                fileId: newFileId
            }
        }
    });

    return Promise.resolve(getState());
};

export const deleteRule = ({ fileId, ruleId }) => async (dispatch, getState) => {
    const res = await axios.delete(`${ROOT_URL}/delete/${fileId}/${ruleId}`);

    let payload = {};

    if (res.data) {
        payload["fileId"] = res.data.fileid;
        payload["ruleIds"] = res.data.ruleids;
        payload["originalFile"] = res.data.originalFile;
    }

    dispatch({
        type: DELETE_RULE,
        payload,
        response: res.statusText
    });

    return Promise.resolve(getState());
};
