/*
* @vitest-environment happy-dom
 */
import {describe, it, expect, vi, beforeEach, afterEach, Mock} from "vitest";
import {useStore} from "vuex";
import {useSnackbar} from "../../hooks/useSnackbar.ts";
import {shallowMount} from "@vue/test-utils";
import NotificationSnackbar from "./NotificationSnackbar.vue";
import {reactive} from "vue";

vi.mock('vuex', async () => {
    const actual = await vi.importActual('vuex');
    return {
        ...actual,
        useStore: vi.fn()
    }
});

vi.mock('../../hooks/useSnackbar.ts', () => ({
    useSnackbar: vi.fn(),
}));

describe('NotificationSnackbar', () => {
    let storeMock: any;
    let useSnackbarMock: any;

    beforeEach(() => {
        storeMock = reactive({
            state: {
                notificationModule: {
                    actionNotifications: [],
                },
            },
        });
        useSnackbarMock = {
            show: false,
            showSnackBar: vi.fn(),
            closeSnackBar: vi.fn(),
        };

        (useStore as Mock).mockReturnValue(storeMock);
        (useSnackbar as Mock).mockReturnValue(useSnackbarMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    })

    it('должен рендерить MSnackBar с правильными пропсами', () => {
        const wrapper = shallowMount(NotificationSnackbar);

        expect(wrapper.findComponent({name: 'MSnackBar'}).exists()).toBe(true);
        expect(wrapper.findComponent({name: 'MSnackBar'}).props()).toMatchObject({
            show: false,
            text: '',
            type: 'info',
            closeSnackBar: useSnackbarMock.closeSnackBar,
        });
    });

    it('должен обновлять текст и тип при добавлении уведомления', async () => {
        const wrapper = shallowMount(NotificationSnackbar);

        // Добавляем уведомление в store
        storeMock.state.notificationModule.actionNotifications.push({
            message: 'Test Message',
            type: 'success',
        });

        // Обновляем реактивный контекст
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent({name: 'MSnackBar'}).props('text')).toBe('Test Message');
        expect(wrapper.findComponent({name: 'MSnackBar'}).props('type')).toBe('success');
        expect(useSnackbarMock.showSnackBar).toHaveBeenCalled();

        storeMock.state.notificationModule.actionNotifications.push({
            message: 'Test Second Message',
            type: 'error',
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent({name: 'MSnackBar'}).props('text')).toBe('Test Second Message');
        expect(wrapper.findComponent({name: 'MSnackBar'}).props('type')).toBe('error');
        expect(useSnackbarMock.showSnackBar).toHaveBeenCalled();
    });
});
