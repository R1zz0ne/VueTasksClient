/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MButton from "./MButton.vue";
import {IPropsMButtonType} from "../../models/UIComponsentsModels.ts";

describe('MButton', () => {
    //Проверка рендера
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MButton)
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.classes()).toContain('primary')
        expect(wrapper.find('button').exists()).toBeTruthy()
    })
    //Проверка слота
    it.each(['Тест кнопки', 'Другой слот'])('Проверка содержимого слота: %s', async (slotContent) => {
        const wrapper = mount(MButton, {
            slots: {default: slotContent}
        })
        expect(wrapper.find("button").text()).toEqual(slotContent)
    })

    //Проверка клика
    it('Проверка нажатия по кнопке', async () => {
        const wrapper = mount(MButton)
        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toHaveLength(1)
    })
    //Проверка классов
    it.each([['primary', 'primary'],
        ['success', 'success'],
        ['danger', 'danger'],
        ['none', 'none'],
        [undefined, 'primary'],
        ['test', 'primary']
    ])('Проверка отрисовки с типом %s', async (type, expectedClass) => {
        const wrapper = mount(MButton, {props: {type: type as unknown as IPropsMButtonType}})
        expect(wrapper.classes()).toContain(expectedClass)
    })

    it('Проверка отрисовки без указания типа', async () => {
        const wrapper = mount(MButton)
        expect(wrapper.classes()).toContain('primary')
    })
})