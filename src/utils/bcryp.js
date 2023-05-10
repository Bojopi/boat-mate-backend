import bcryptjs from 'bcrypt'

export const encriptPassword = async (password) => {
    try {
        const resHash = bcryptjs.hashSync(password, 12);
        return resHash;
    } catch (error) {
        console.error(error)
        return
    }
}

export const decryptPassword = async (password, hash) => {
    try {
        const resCompare = await bcryptjs.compareSync(password, hash);
        if(resCompare) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}