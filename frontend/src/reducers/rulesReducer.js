import {
    GET_RULE,
    GET_ALL_RULES,
    APPLY_RULE
} from '../actions/types';

const INITIAL_STATE = {
    ruleIds: null,
    rule: null,
    response: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_RULES:
            return { ...state, ...action.payload };
        case GET_RULE:
            return { ...state, ...action.payload };
        case APPLY_RULE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}