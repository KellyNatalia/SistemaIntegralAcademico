class UpdateUserDTO {
    constructor(name, email, password, role, status = true) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
    }
}

export default UpdateUserDTO
