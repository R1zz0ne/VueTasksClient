/*
* @vitest-environment happy-dom
 */
import {describe, it, expect, vi} from 'vitest';
import {mount} from "@vue/test-utils";
import MSelect from "../../../src/components/ui/MSelect.vue";


describe('SelectComponent', () => {
    it('Корректно рендерится с начальным значением', () => {
        const elements = { option1: 'Option 1', option2: 'Option 2' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'string'
            }
        })
        expect(wrapper.find('select').element.value).toBe('option1')
    })
    it('Проверка рендера всех опций', () => {
        const elements = { option1: 'Option 1', option2: 'Option 2', option3: 'Option 3' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'string'
            }
        })
        const options = wrapper.findAll('option')
        expect(options.length).toBe(3)
        expect(options[0].text()).toBe('Option 1')
        expect(options[1].text()).toBe('Option 2')
        expect(options[2].text()).toBe('Option 3')
    })
    it('Проверка изменения значения для строки (type: string)', async () => {
        const elements = { option1: 'Option 1', option2: 'Option 2' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'string'
            }
        })
        await wrapper.find('select').setValue('option2')
        expect(wrapper.find('select').element.value).toBe('option2')
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['option2'])
    })
    it('Проверка изменения значения для числа (type: number)', async () => {
        const elements = { 1: 'Option 1', 2: 'Option 2' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: '1',
                elements,
                type: 'number'
            }
        })
        await wrapper.find('select').setValue('2')
        expect(wrapper.find('select').element.value).toBe('2')
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([2])
    })
    it('Рендер без опций при пустом elements', () => {
        const elements = {}
        const wrapper = mount(MSelect, {
            props: {
                modelValue: null,
                elements,
                type: 'string'
            }
        })

        expect(wrapper.findAll('option').length).toBe(0)
    })
    it('Проверка поведения при нечисловых значениях для type: number', async () => {
        const elements = { a: 'Option A', b: 'Option B' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'a',
                elements,
                type: 'number'
            }
        })
        await wrapper.find('select').setValue('b')
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([NaN])
    })
    it('Проверка обновления при изменении modelValue', async () => {
        const elements = { option1: 'Option 1', option2: 'Option 2' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'string'
            }
        })
        await wrapper.setProps({ modelValue: 'option2' })
        expect(wrapper.find('select').element.value).toBe('option2')
    })
    it('Проверка поведения при некорректных данных в elements', () => {
        const elements = 'not an object'  // Некорректные данные
        const wrapper = mount(MSelect, {
            props: {
                modelValue: null,
                elements,
                type: 'string'
            }
        })
        expect(wrapper.findAll('option').length).toBe(0)
    })
    it('Проверка поведения при невалидном type', () => {
        const elements = { option1: 'Option 1', option2: 'Option 2' }
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'invalid' as unknown as 'number' | 'string'
            }
        })
        expect(wrapper.find('select').element.value).toBe('option1')
    })

})