import {createRouter, createWebHistory} from 'vue-router'
import TasksPage from "../components/body/taskPage/TasksPage.vue";
import Authorizationpage from "../components/pages/authorizationpage/authorizationpage.vue";
import AppPage from "../components/AppPage.vue";
import NoContentPage from "../components/body/NoContentPage.vue";
import ProjectsPage from "../components/body/projectspage/ProjectsPage.vue";
import Registrationpage from "../components/pages/registrationpage/registrationpage.vue";
import {useStore} from "vuex";
import BoardPage_copy from "../components/body/BoardPage_copy.vue";
import BoardPage from "../components/body/boardPage/BoardPage.vue";

const routes = [
    {
        path: '/authorization',
        component: Authorizationpage
    },
    {
        path: '/registration',
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
                component: TasksPage,
                children: [
                    {
                        path: ':id',
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
                component: ProjectsPage,
                children: [
                    {
                        path: ':id',
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
                component: BoardPage,
                children: [
                    {
                        path: ':id',
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
            },
            {
                path: 'board_test',
                component: BoardPage_copy
            }
        ]
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router