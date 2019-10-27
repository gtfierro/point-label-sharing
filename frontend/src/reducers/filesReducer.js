import {
    GET_FILE,
    GET_ALL_FILE_IDS,
    GET_ALL_FILES,
    CREATE_FILE,
    UPDATE_FILE
} from '../actions/types';

const INITIAL_STATE = {
    fileIds: null,
    files: null,
    response: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case GET_ALL_FILE_IDS:
        case GET_ALL_FILES:
        case GET_FILE:
        case UPDATE_FILE:
        case CREATE_FILE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}