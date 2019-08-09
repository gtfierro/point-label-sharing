import { combineReducers } from 'redux';
import templates from './templatesReducer';
import rules from './rulesReducer';
import files from './filesReducer';
import errors from './errorsReducer';

export default combineReducers({
    templates,
    rules,
    files,
    errors
});