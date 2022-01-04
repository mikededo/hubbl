import auth from './auth.middleware';
import {postRequest, preRequest} from './logger.middleware'

export default { auth, postRequest, preRequest };
