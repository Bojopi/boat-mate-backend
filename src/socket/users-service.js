class UsersService{
    constructor(){
        this.users = []
    }

    getUserById(uid){
        const user = this.users.find((user) => user.uid === uid)
        return user
    }

    addUser(user){
        this.users.push(user)
        return this.users
    }

    deleteUser(uid){
        const users = this.users.filter(user => user.uid !== uid)
        this.users = users
        return users
    }

    getCustomerById(id){
        const customer = this.users.find((user) => user.idCustomer === id)
        return customer
    }


    //New methods for rooms
    joinUserToChat(id, userId, roomId){
        const userJoin = {id, userId, roomId}
        this.users.push(userJoin)
        return userJoin
    };

    getCurrentUser(id){
        return this.users.find((user) => user.id === id);
    };

    disconnectUser(id){
        const index =  this.users.findIndex((user) => user.id === id);
        if(index !== 1) {
            return this.users.splice(index, 1)[0];
        }
    }
}

export default UsersService