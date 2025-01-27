/*
* @vitest-environment happy-dom
 */
import {describe, it, expect} from "vitest";
import {DOMWrapper, mount} from "@vue/test-utils";
import MTextarea from "./MTextarea.vue";

describe('MSnackBar', () => {
    it('Проверка рендера без пропсов', () => {
        const wrapper = mount(MTextarea)
        expect(wrapper.find('div.text-area-active').exists()).toBe(true);
        expect(wrapper.find('div.text-area-active textarea.active').exists()).toBe(true);
        expect(wrapper.find('div.text-area-active textarea.active').attributes('rows')).toBe('5');
        expect(wrapper.find('div.text-area-active').attributes('style')).toContain('height: 82px');
    })

    it.each([[false, 'div.text-area-active', 'div.text-area-active textarea.active'],
        [true, 'div.text-area-disabled', 'div.text-area-disabled textarea.disabled']])
    ('Проверка рендера при disabled = %s',
        (isDisabled: boolean, expectedDivClass: string, expectedTextareaClass: string) => {
            const wrapper = mount(MTextarea, {
                props: {
                    disabled: isDisabled
                }
            })
            expect(wrapper.find(expectedDivClass).exists()).toBe(true);
            expect(wrapper.find(expectedTextareaClass).exists()).toBe(true);
        })

    it.each([['5', 'height: 82px'],
        ['10', 'height: 162px']])
    ('Проверка установки rows и высоты div при rows = %s', (rows: string, height: string) => {
        const wrapper = mount(MTextarea, {
            props: {
                rows: rows
            }
        })
        expect(wrapper.find('div.text-area-active textarea.active').attributes('rows')).toBe(rows);
        expect(wrapper.find('div.text-area-active').attributes('style')).toContain(height);
    })

    it('Проверка modelValue', async () => {
        const wrapper = mount(MTextarea, {
            props: {
                modelValue: '',
                'onUpdate:modelValue': (e: any) => wrapper.setProps({modelValue: e}),
            }
        })
        const textarea: DOMWrapper<HTMLTextAreaElement> = wrapper.find('div.text-area-active textarea.active');
        expect(textarea.element.value).toBe('')

        await textarea.setValue('Тест обновления через modelValue!')
        expect(wrapper.props('modelValue')).toBe('Тест обновления через modelValue!')
        expect(wrapper.emitted('update:modelValue')![0]).toHaveLength(1)
        expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Тест обновления через modelValue!'])
        await wrapper.vm.$nextTick();
        expect(textarea.element.value).toBe('Тест обновления через modelValue!')
    })
});
