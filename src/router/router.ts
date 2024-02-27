import {createRouter, createWebHistory} from 'vue-router'
import TasksPage from "../components/body/TasksPage.vue";
import Authorizationpage from "../components/pages/authorizationpage/authorizationpage.vue";
import AppPage from "../components/AppPage.vue";
import NoContentPage from "../components/body/NoContentPage.vue";
import ProjectsPage from "../components/body/projectspage/ProjectsPage.vue";
import Registrationpage from "../components/pages/registrationpage/registrationpage.vue";

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
                component: TasksPage
            },
            {
                path: 'projects',
                component: ProjectsPage
            }
        ]
    },
]
// ]const routes = [
//     {
//         path: '/',
//         component: DefaultPage
//     },
//     {
//         path: '/tasks',
//         component: TasksPage
//     },
//     {
//         path: '/projects',
//         component: ProjectsPage
//     },{
//         path: '/authorization',
//         component: {
//             authorization: Authorizationpage
//         }
//     },{
//         path: '/registration',
//         component: ProjectsPage
//     },
// ]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router