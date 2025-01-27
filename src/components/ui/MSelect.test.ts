/*
* @vitest-environment happy-dom
 */
import {describe, expect, it} from 'vitest';
import {mount} from "@vue/test-utils";
import MSelect from "./MSelect.vue";
import {taskPriorityMap, taskStatusMap} from "../../utils/constants.ts";

describe('MSelect', () => {
    it('Корректно рендерится с начальным значением', () => {
        const elements = taskStatusMap;
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'assigned',
                elements,
                type: 'string'
            }
        })
        expect(wrapper.find('select').element.value).toBe('assigned')
    })
    it('Проверка рендера всех опций', () => {
        const elements = taskPriorityMap;
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'high',
                elements,
                type: 'string'
            }
        })
        const options = wrapper.findAll('option')
        expect(options.length).toBe(4)
        expect(options[0].text()).toBe('1 - Критический')
        expect(options[1].text()).toBe('2 - Высокий')
        expect(options[2].text()).toBe('3 - Средний')
        expect(options[3].text()).toBe('4 - Низкий')
    })
    it('Проверка изменения значения для строки (type: string)', async () => {
        const elements = taskStatusMap
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'inProgress',
                elements,
                type: 'string'
            }
        })
        await wrapper.find('select').setValue('inProgress')
        expect(wrapper.find('select').element.value).toBe('inProgress')
        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted).toBeDefined()
        expect(emitted![0]).toEqual(['inProgress'])
    })
    it('Проверка изменения значения для числа (type: number)', async () => {
        const elements = {1: 'Option 1', 2: 'Option 2'} as unknown as typeof taskStatusMap
        const wrapper = mount(MSelect, {
            props: {
                modelValue: '1',
                elements,
                type: 'number'
            }
        })
        await wrapper.find('select').setValue('2')
        expect(wrapper.find('select').element.value).toBe('2')
        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted).toBeDefined()
        expect(emitted![0]).toEqual([2])
    })
    it('Рендер без опций при пустом elements', () => {
        const elements = {} as unknown as typeof taskStatusMap
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
        const elements = {a: 'Option A', b: 'Option B'} as unknown as typeof taskStatusMap
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'a',
                elements,
                type: 'number'
            }
        })
        await wrapper.find('select').setValue('b')
        const emitted = wrapper.emitted('update:modelValue')
        expect(emitted).toBeDefined()
        expect(emitted![0]).toEqual([NaN])
    })
    it('Проверка обновления при изменении modelValue', async () => {
        const elements = {option1: 'Option 1', option2: 'Option 2'} as unknown as typeof taskStatusMap
        const wrapper = mount(MSelect, {
            props: {
                modelValue: 'option1',
                elements,
                type: 'string'
            }
        })
        await wrapper.setProps({modelValue: 'option2'})
        expect(wrapper.find('select').element.value).toBe('option2')
    })
    it('Проверка поведения при некорректных данных в elements', () => {
        const elements = 'not an object' as unknown as typeof taskStatusMap
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
        const elements = {option1: 'Option 1', option2: 'Option 2'} as unknown as typeof taskStatusMap
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