import {
    GET_RULE,
    GET_ALL_RULE_IDS,
    GET_ALL_RULES,
    CREATE_RULE,
    APPLY_RULE
} from '../actions/types';

const INITIAL_STATE = {
    ruleIds: null,
    rules: null,
    response: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_RULE_IDS:
        case GET_ALL_RULES:
        case GET_RULE:
        case CREATE_RULE:
        case APPLY_RULE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}