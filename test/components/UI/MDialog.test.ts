/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MDialog from "../../../src/components/ui/MDialog.vue";


describe('MDialog tests', () => {
    it('Проверка создания и не видимости без пропсов', () => {
        const wrapper = mount(MDialog)
        expect(wrapper.isVisible()).toBe(false)
        expect(wrapper.find('div').exists()).toBe(false)
    })
    it('Проверка создания и не видимости с пропсами', () => {
        const wrapper = mount(MDialog, {
            props: {show: false, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(false)
        expect(wrapper.find('div').exists()).toBe(false)
    })
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div.dialog').exists()).toBe(true)
        expect(wrapper.find('div.dialogContent').exists()).toBe(true)
    })
    it('Проверка выполнения эмита на обновление состояния видимости', () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "all"}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div.dialog').exists()).toBe(true)
        expect(wrapper.find('div.dialogContent').exists()).toBe(true)
        wrapper.find('.dialog').trigger('click')
        expect(wrapper.emitted()).toHaveProperty('update:show')
        expect(wrapper.emitted('update:show')[0]).toEqual([false])
    })
    it('Проверка не закрытия диалога при isClose<>all', () => {
        const wrapper = mount(MDialog, {
            props: {show: true, isClose: "test"}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div.dialog').exists()).toBe(true)
        expect(wrapper.find('div.dialogContent').exists()).toBe(true)
        wrapper.find('.dialog').trigger('click')
        expect(wrapper.emitted()).not.toHaveProperty('update:show')
        expect(wrapper.emitted()).toHaveProperty('click')
    })
    it('Проверка слота тестом', () => {
        const wrapper = mount(MDialog, {
            props: {show: true},
            slots: {default: "Тестовый текст"}
        })
        expect(wrapper.find('div.dialogContent').text()).toEqual("Тестовый текст")
    })
    it('Проверка слота с div элементом', () => {
        const wrapper = mount(MDialog, {
            props: {show: true},
            slots: {default: '<div class="test-div">Тестовый элемент</div>'}
        })
        expect(wrapper.find('div.dialog').exists()).toBe(true)
        expect(wrapper.find('div.dialogContent').exists()).toBe(true)
        expect(wrapper.find('div.test-div').exists()).toBe(true)
        expect(wrapper.find('div.test-div').text()).toEqual("Тестовый элемент")
    })
})