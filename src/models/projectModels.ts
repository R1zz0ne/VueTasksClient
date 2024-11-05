import {IUser} from "./userModels.ts";
import {ITaskShort} from "./taskModels.ts";
import {IPageInfo} from "./otherModels.ts";

export interface IProjectModuleState {
    projectList: IProjectList[],
    currentProject: IProject,
    projectRoom: Pick<IUser, 'userId' | 'name'>[],
    boardRoom: Pick<IUser, 'userId' | 'name'>[],
    pageInfo: IPageInfo
}

export interface IProjectList extends Pick<IProject, 'projectId' | 'name'> {
}

export interface IDataForUpdateProject extends Omit<IProject, 'tasks' | 'owner' | 'editor'> {
    owner: number
}

export interface IProject {
    projectId: number,
    name: string,
    description: string,
    owner: IUser,
    tasks: ITaskShort[],
    editor: {
        userId: number,
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
    projectId: number,
    editor: number | null
}

export interface IProjectResponse {
    projectId: number,
    name: string,
    description: string,
    owner: IUser,
    tasks: Omit<ITaskShort, 'editor'>[],
    editor: {
        userId: number,
        name: string
    } | null
}