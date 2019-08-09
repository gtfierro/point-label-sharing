import {
    GET_FILE,
    GET_ALL_FILES,
    CREATE_FILE
} from '../actions/types';

const INITIAL_STATE = {
    fileIds: null,
    file: null,
    response: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_FILES:
            return { ...state, ...action.payload };
        case GET_FILE:
            return { ...state, ...action.payload };
        case CREATE_FILE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}