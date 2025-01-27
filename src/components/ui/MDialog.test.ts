/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MDialog from "./MDialog.vue";


describe('MDialog', () => {
    it('Проверка создания и не видимости без пропса isShow', () => {
        const wrapper = mount(MDialog, {
            props: {show: false}
        })
        expect(wrapper.isVisible()).toBe(false)
        expect(wrapper.find('.dialog').exists()).toBe(false)
    })
    it('Проверка создания и не видимости с пропсами', () => {
        const wrapper = mount(MDialog, {
            props: {show: false, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(false)
        expect(wrapper.find('.dialog').exists()).toBe(false)
    })
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('.dialog').exists()).toBe(true)
        expect(wrapper.find('.dialog-content').exists()).toBe(true)
    })
    it('Проверка выполнения эмита на обновление состояния видимости', async () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "all"}
        })

        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('.dialog').exists()).toBe(true)
        expect(wrapper.find('.dialog-content').exists()).toBe(true)

        await wrapper.find('.dialog').trigger('click')

        expect(wrapper.emitted()).toHaveProperty('update:show')
        const emitted = wrapper.emitted('update:show')
        expect(emitted).toHaveLength(1);
        expect(emitted).toBeDefined();
        expect(emitted![0]).toEqual([false])
    })
    it('Проверка не закрытия диалога при isClose<>all', () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('.dialog').exists()).toBe(true)
        expect(wrapper.find('.dialog-content').exists()).toBe(true)
        wrapper.find('.dialog').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('click')
        expect(wrapper.emitted('click')).toHaveLength(1)
        expect(wrapper.emitted()).not.toHaveProperty('update:show')
    })
    it('Проверка слота тестом', () => {
        const wrapper = mount(MDialog, {
            props: {show: true},
            slots: {default: "Тестовый текст"}
        })
        expect(wrapper.find('.dialog-content').text()).toEqual("Тестовый текст")
    })
    it('Проверка слота с div элементом', () => {
        const wrapper = mount(MDialog, {
            props: {show: true},
            slots: {default: '<div class="test-div">Тестовый элемент</div>'}
        })
        expect(wrapper.find('.dialog').exists()).toBe(true)
        expect(wrapper.find('.dialog-content').exists()).toBe(true)
        expect(wrapper.find('.test-div').exists()).toBe(true)
        expect(wrapper.find('.test-div').text()).toEqual("Тестовый элемент")
    })
    it('Проверка обновления пропса show', async () => {
        const wrapper = mount(MDialog, {props: {show: false}})
        expect(wrapper.isVisible()).toBe(false)
        expect(wrapper.find('.dialog').exists()).toBe(false)
        await wrapper.setProps({show: true})
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('.dialog').exists()).toBe(true)
    })
})