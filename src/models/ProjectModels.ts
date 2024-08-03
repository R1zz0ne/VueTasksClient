import {IUser} from "./UserModels.ts";
import {ITaskShort} from "./TaskModels.ts";

export interface IProjectModuleState {
    projectList: IProjectList[],
    currentProject: IProject
}

export interface IProjectList extends Pick<IProject, 'project_id' | 'name'> {
}

export interface IDataForUpdateProject extends Omit<IProject, 'tasks' | 'owner'> {
    owner: number
}

export interface IProject {
    project_id: number,
    name: string,
    description: string,
    owner: IUser,
    tasks: ITaskShort[]
}

export interface IProjectProps {
    mode: string,
    setMode: Function
}

export interface ICreateProjectEmit {
    name: string,
    description: string,
    owner: number
}