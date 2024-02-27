import $api from "./API.ts";

export default class ApiAuth {
    static async registration(name: string, email: string, password: string) {
        return $api.post('/registration', {name, email, password});
    }

    static async login(email: string, password: string) {
        return $api.post('/login', {email, password});
    }

    static async logout() {
        return $api.post('/logout');
    }

    static async  refresh() {
        return $api.get('/refresh');
    }
}