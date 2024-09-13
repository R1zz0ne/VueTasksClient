import {IUser} from "./UserModels.ts";
import {ITaskShort} from "./TaskModels.ts";
import {IPageInfo} from "./otherModels.ts";

export interface IProjectModuleState {
    projectList: IProjectList[],
    currentProject: IProject,
    projectRoom: Pick<IUser, 'user_id' | 'name'>[],
    boardRoom: Pick<IUser, 'user_id' | 'name'>[],
    pageInfo: IPageInfo
}

export interface IProjectList extends Pick<IProject, 'project_id' | 'name'> {
}

export interface IDataForUpdateProject extends Omit<IProject, 'tasks' | 'owner' | 'editor'> {
    owner: number
}

export interface IProject {
    project_id: number,
    name: string,
    description: string,
    owner: IUser,
    tasks: ITaskShort[],
    editor: {
        user_id: number,
        name: string
    } | null
}

export interface IProjectProps {
    mode: string,
    setMode: (value: 'view' | 'edit' | 'create', updateEditor: boolean) => void
}

export interface ICreateProjectEmit {
    name: string,
    description: string,
    owner: number
}

export interface IProjectUpdateEditor {
    project_id: number,
    editor: number | null
}