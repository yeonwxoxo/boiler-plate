import axios from 'axios';
import {
    LOGIN_USER
} from './types';

export function loginUser(dataToSubmit) {

    const requset = axios.post('/api/users/login',dataToSubmit)
    .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: requset
    }
}