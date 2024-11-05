import {createRouter, createWebHistory} from 'vue-router'
import {useStore} from "vuex";
import SocketEmit from "../api/socketEmit.ts";
import AuthorizationPage from "../components/pages/authorizationPage/AuthorizationPage.vue";
import RegistrationPage from "../components/pages/registrationPage/RegistrationPage.vue";
import AppPage from "../components/AppPage.vue";
import NoContentPage from "../components/pages/bodyPage/body/NoContentPage.vue";
import TasksPage from "../components/pages/bodyPage/body/taskPage/TasksPage.vue";
import ProjectsPage from "../components/pages/bodyPage/body/projectsPage/ProjectsPage.vue";
import BoardPage from "../components/pages/bodyPage/body/boardPage/BoardPage.vue";

const routes = [
    {
        path: '/authorization',
        name: 'authorization',
        component: AuthorizationPage
    },
    {
        path: '/registration',
        name: 'registration',
        component: RegistrationPage
    },
    {
        path: '/',
        component: AppPage,
        children: [
            {
                path: '',
                component: NoContentPage
            },
            {
                path: 'tasks',
                name: 'tasks',
                component: TasksPage,
                children: [
                    {
                        path: ':id',
                        name: 'tasks',
                        component: TasksPage
                    }
                ],
                beforeEnter: async () => {
                    const store = useStore()
                    await SocketEmit.getTaskListEmit(store.state.taskModule.pageInfo.page);
                }
            },
            {
                path: 'projects',
                name: 'projects',
                component: ProjectsPage,
                children: [
                    {
                        path: ':id',
                        name: 'projects',
                        component: ProjectsPage
                    }
                ],
                beforeEnter: async () => {
                    const store = useStore()
                    await SocketEmit.getProjectListEmit(store.state.projectModule.pageInfo.page);
                }
            },
            {
                path: 'board',
                name: 'board',
                component: BoardPage,
                children: [
                    {
                        path: ':id',
                        name: 'board',
                        component: BoardPage
                    }
                ],
                beforeEnter: async () => {
                    const store = useStore()
                    await SocketEmit.getProjectListEmit(store.state.projectModule.pageInfo.page);
                }
            }
        ]
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router