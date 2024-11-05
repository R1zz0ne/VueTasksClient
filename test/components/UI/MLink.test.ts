/*
* @vitest-environment happy-dom
 */
import {describe, it, expect, vi} from 'vitest';
import {mount} from "@vue/test-utils";
import MLink from "../../../src/components/ui/MLink.vue";


describe('MLink tests', () => {
    it('Проверка создания и видимости', () => {
        const wrapper = mount(MLink)
        expect(wrapper.isVisible()).toBe(true)
        expect(wrapper.find('a').exists()).toBeTruthy()
    })
    it('Проверка формирования ссылки', () => {
        const testProps = {
            clickFunc: () => {
            },
            id: 12,
            object: "testobj"
        }
        const wrapper = mount(MLink, {
            props: testProps
        })
        expect(wrapper.find('a').exists()).toBe(true)
        expect(wrapper.attributes('href')).toEqual('/testobj/12')
    })
    it('Проверка вызова функции по нажатию', () => {
        const testProps = {
            clickFunc: vi.fn(),
            id: 12,
            object: "testobj"
        }
        const wrapper = mount(MLink, {
            props: testProps
        })
        expect(wrapper.find('a').exists()).toBe(true)
        wrapper.find('a').trigger('click')
        expect(testProps.clickFunc).toHaveBeenCalledTimes(1)
        expect(testProps.clickFunc).toHaveBeenCalledWith(testProps.id)
    })
    it('Проверка слота', () => {
        const testProps = {
            clickFunc: () => {
            },
            id: 12,
            object: "testobj"
        }
        const wrapper = mount(MLink, {
            props: testProps,
            slots: {default: 'Текст ссылки'}
        })
        expect(wrapper.find('a').text()).toEqual('Текст ссылки')
    })
})