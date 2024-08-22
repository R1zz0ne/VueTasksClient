import {createRouter, createWebHistory} from 'vue-router'
import {useStore} from "vuex";
import Authorizationpage from "../components/pages/authorizationpage/authorizationpage.vue";
import Registrationpage from "../components/pages/registrationpage/registrationpage.vue";
import AppPage from "../components/AppPage.vue";
import NoContentPage from "../components/pages/bodypage/body/NoContentPage.vue";
import TasksPage from "../components/pages/bodypage/body/taskPage/TasksPage.vue";
import ProjectsPage from "../components/pages/bodypage/body/projectspage/ProjectsPage.vue";
import BoardPage from "../components/pages/bodypage/body/boardPage/BoardPage.vue";

const routes = [
    {
        path: '/authorization',
        name: 'authorization',
        component: Authorizationpage
    },
    {
        path: '/registration',
        name: 'registration',
        component: Registrationpage
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
                    try {
                        await store.dispatch('taskModule/getTaskListAC')
                    } catch (e) {
                        console.log('Произошла ошибка при получении списка задач (router)') //TODO: закинуть это все в setError
                    }
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
                    try {
                        await store.dispatch('projectModule/getProjectListAC')
                    } catch (e) {
                        console.log('Произошла ошибка при получении списка проектов (router)') //TODO: закинуть это все в setError
                    }
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
                    try {
                        await store.dispatch('projectModule/getProjectListAC')
                    } catch (e) {
                        console.log('Произошла ошибка при получении списка проектов (router)') //TODO: закинуть это все в setError
                    }
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