/*
* @vitest-environment happy-dom
 */
import {describe, it, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import MSnackBar from "./MSnackBar.vue";
import {ITypeNotification} from "../../models/notificationModels.ts";

describe('MSnackBar', () => {
    it('Проверка рендера', () => {
        const wrapper = mount(MSnackBar, {
            props: {show: true, text: 'Тест', closeSnackBar: vi.fn()}
        })
        expect(wrapper.find('.snackbar').exists()).toBe(true);
        expect(wrapper.find('.snackbar .msg-block.info').exists()).toBe(true);
        expect(wrapper.find('.snackbar span').exists()).toBe(true);
        expect(wrapper.find('.snackbar span').text()).toBe('Тест');
        expect(wrapper.find('.snackbar .close-btn').exists()).toBe(true);
        expect(wrapper.findComponent({name: 'MButton'}).exists()).toBe(true);
        expect(wrapper.findComponent({name: 'CloseSVG'}).exists()).toBe(true);
    })

    it.each([[undefined, 'info'],
        ['error', 'error'],
        ['info', 'info'],
        ['success', 'success'],
        ['warning', 'warning']
    ])('Проверка рендера с типом %s', async (type, expectedClass) => {
        const wrapper = mount(MSnackBar, {
            props: {show: true, type: type as unknown as ITypeNotification, text: 'Тест', closeSnackBar: vi.fn()}
        })
        expect(wrapper.find('.snackbar .msg-block').classes()).toContain(expectedClass);
    })

    it('Проверка скрытия формы после изменения show на false', async () => {
        const wrapper = mount(MSnackBar, {
            props: {show: true, text: 'Тест', closeSnackBar: vi.fn()}
        })
        expect(wrapper.find('.snackbar').exists()).toBe(true);
        expect(wrapper.find('.snackbar .msg-block').exists()).toBe(true);
        await wrapper.setProps({show: false, text: 'Тест', closeSnackBar: vi.fn()})
        expect(wrapper.find('.snackbar').exists()).toBe(false);
        expect(wrapper.find('.snackbar .msg-block').exists()).toBe(false);
    })

    it('Проверка обновления текста при изменении text', async () => {
        const wrapper = mount(MSnackBar, {
            props: {show: true, text: 'Тест', closeSnackBar: vi.fn()}
        })
        expect(wrapper.find('.snackbar span').text()).toBe('Тест');
        await wrapper.setProps({text: 'Новый текст'})
        expect(wrapper.find('.snackbar span').text()).toBe('Новый текст');
    })

    it('Проверка вызова функции closeSnackBar при нажатии кнопки закрытия', async () => {
        const wrapper = mount(MSnackBar, {
            props: {show: true, type: 'info', text: 'Тест', closeSnackBar: vi.fn()}
        })
        expect(wrapper.props().closeSnackBar).toHaveBeenCalledTimes(0)
        await wrapper.find('.snackbar .msg-block .close-btn').trigger('click')
        expect(wrapper.props().closeSnackBar).toHaveBeenCalledTimes(1)
    })
});
