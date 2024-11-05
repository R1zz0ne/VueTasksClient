/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MErrorMessage from "../../../src/components/ui/MErrorMessage.vue";

describe('MErrorMessage tests', () => {
    it('Проверка отрисовки с пустым массивом ошибок', () => {
        const myError = {_errors: []}
        const wrapper = mount(MErrorMessage, {
            props: {errors: myError}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.find('span').exists()).toBe(false)
    })
    it('Проверка отрисовки с 1 ошибкой', () => {
        const myError = {_errors: ["Тестовый комментарий"]}
        const wrapper = mount(MErrorMessage, {
            props: {errors: myError}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.findAll('span')).toHaveLength(1)
        expect(wrapper.findAll('span')[0].text()).toEqual('Тестовый комментарий')
    })
    it('Проверка отрисовки c несколькими ошибками', () => {
        const myError = {_errors: ["Тестовый комментарий", 123, {test: "test1"}]}
        const wrapper = mount(MErrorMessage, {
            props: {errors: myError}
        })
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.findAll('span')).toHaveLength(3)
        expect(wrapper.findAll('span')[0].text()).toEqual('Тестовый комментарий')
        expect(wrapper.findAll('span')[1].text()).toEqual("123")
        expect(wrapper.findAll('span')[2].text()).toEqual(`{\n  "test": "test1"\n}`)
    })
})