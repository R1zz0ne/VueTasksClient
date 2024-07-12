import $api from "./API.ts";

export default class ApiUsers {
    static async getUsers(stringSearch: string) {
        return $api.get(`/users?query=${stringSearch}`);
    }
}