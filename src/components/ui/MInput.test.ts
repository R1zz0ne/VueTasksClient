/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from 'vitest';
import {mount} from "@vue/test-utils";
import MInput from "./MInput.vue";


describe('MInput', () => {
    //Проверка рендера
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MInput)
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('input').exists()).toBeTruthy()
    })
    //Проверка placeholder
    it('Проверка без передачи placeholder', () => {
        const wrapper = mount(MInput)
        expect(wrapper.element.placeholder).toBe('')
    })
    it('Проверка пустого placeholder', () => {
        const wrapper = mount(MInput, {props: {placeholder: ''}})
        expect(wrapper.element.placeholder).toBe('')
    })
    it('Проверка переданного placeholder', () => {
        const wrapper = mount(MInput, {props: {placeholder: 'Подсказка'}})
        expect(wrapper.element.placeholder).toBe('Подсказка')
    })
    //Проверка modelValue
    it('Проверка modelValue', async () => {
        const wrapper = mount(MInput, {
            props: {
                modelValue: '',
                'onUpdate:modelValue': (e: any) => wrapper.setProps({modelValue: e}),
            }
        })
        await wrapper.find('input').setValue('Test update model value!')
        expect(wrapper.props('modelValue')).toBe('Test update model value!')
    })
    //Проверка readonly
    it('Проверка без передачи readonly', () => {
        const wrapper = mount(MInput)
        expect(wrapper.attributes('readonly')).toBeUndefined()
        expect(wrapper.classes('readonly')).toBe(false)
    })
    it('Проверка переданного readonly=false', () => {
        const wrapper = mount(MInput, {props: {readonly: false}})
        expect(wrapper.attributes('readonly')).toBeUndefined()
        expect(wrapper.classes('readonly')).toBe(false)
    })
    it('Проверка переданного readonly=true', () => {
        const wrapper = mount(MInput, {props: {readonly: true}})
        expect(wrapper.attributes()).toHaveProperty('readonly')
        expect(wrapper.classes('readonly')).toBe(true)
    })
})