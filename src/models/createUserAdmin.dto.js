class CreateUserAdminDTO {
    constructor(name, email, password, role, status = true) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = "administrador";
        this.status = status;
    }
}

export default CreateUserAdminDTO
