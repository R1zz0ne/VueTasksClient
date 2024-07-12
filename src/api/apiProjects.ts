import $api from "./API.ts";

export default class ApiProjects {
    static async createProject(name: string, description: string, ownerId: number) {
        return $api.post('/project', {name, description, owner: ownerId})
    }

    static async updateProject(id: number, name: string, description: string, ownerId: number) {
        return $api.post('/projectUpdate', {id, name, description, owner: ownerId})
    }

    static async getProjectList() {
        return $api.get('/projectList');
    }

    static async getProject(id: number) {
        return $api.get(`/project?id=${id}`)
    }
}