/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MButton from "../../../src/components/ui/MButton.vue";
import {IPropsMButtonType} from "../../../src/models/UIComponsentsModels";

describe('MButton tests', () => {
    //Проверка рендера
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MButton)
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('button').exists()).toBeTruthy()
    })
    //Проверка слота
    it('Проверка slot', () => {
        const wrapper = mount(MButton, {
            slots: {default: "Тест кнопки"}
        })
        expect(wrapper.find("button").text()).toEqual("Тест кнопки")
    })
    //Проверка классов
    it('Проверка отрисовки без указания типа', async () => {
        const wrapper = mount(MButton)
        expect(wrapper.classes('primary')).toBe(true)
    })
    it('Проверка отрисовки с типом primary', async () => {
        const wrapper = mount(MButton, {props: {type: 'primary'}})
        expect(wrapper.classes('primary')).toBe(true)
    })
    it('Проверка отрисовки с типом success', async () => {
        const wrapper = mount(MButton, {props: {type: 'success'}})
        expect(wrapper.classes('success')).toBe(true)
    })
    it('Проверка отрисовки с типом danger', async () => {
        const wrapper = mount(MButton, {props: {type: 'danger'}})
        expect(wrapper.classes('danger')).toBe(true)
    })
    it('Проверка отрисовки с типом none', async () => {
        const wrapper = mount(MButton, {props: {type: 'none'}})
        expect(wrapper.classes('none')).toBe(true)
    })
    it('Проверка отрисовки с типом undefined', async () => {
        const wrapper = mount(MButton, {props: {type: undefined}})
        expect(wrapper.classes('primary')).toBe(true)
    })
    it('Проверка отрисовки с недопустимым типом', async () => {
        const wrapper = mount(MButton, {
            props: {
                type: 'test' as unknown as IPropsMButtonType
            }
        })
        expect(wrapper.classes('primary')).toBe(true)
    })
})