import Profile from '../models/Profile.js'

export const usernameExist = async (username = '') => {
    const usrExist = await Profile.findOne({username});
    if(usrExist) {
        throw new Error(`Username: ${username} is already in use`);
    }
}