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
}

export default UsersService