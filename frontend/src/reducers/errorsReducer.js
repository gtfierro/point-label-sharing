import {
    THROW_ERROR
} from '../actions/types';

const INITIAL_STATE = {
    error: null
};

export default function (state=INITIAL_STATE, action) {
    switch (action.type) {
        case THROW_ERROR:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}