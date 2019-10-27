import {
    CREATE_TEMPLATE,
    GET_TEMPLATE,
    GET_ALL_TEMPLATES
} from '../actions/types';

const INITIAL_STATE = {
    templateIds: null,
    template: null,
    response: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_TEMPLATES:
            return { ...state, ...action.payload };
        case GET_TEMPLATE:
            return { ...state, ...action.payload };
        case CREATE_TEMPLATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}