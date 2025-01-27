/*
* @vitest-environment happy-dom
 */
import {mount, VueWrapper} from "@vue/test-utils";
import {describe, it, expect, beforeEach, afterEach, vi, Mock} from "vitest";
import MSelectedInputUser from "./MSelectedInputUser.vue";
import {setError} from "../../services/setError.ts";
import SocketEmit from "../../api/socketEmit.ts";

vi.mock("../../api/socketEmit", () => ({
    default: {
        getUsersEmit: vi.fn(), // Мокируем функцию getUsersEmit
    },
}));

vi.mock("../../services/setError", () => ({
    setError: vi.fn(),
}));

describe("MSelectedInputUser", () => {
    let wrapper: VueWrapper<any>;

    const mockSelectUser = vi.fn();
    const props = {
        selectUser: {userId: 0, name: ""},
        setSelectUser: mockSelectUser,
    };

    beforeEach(() => {
        wrapper = mount(MSelectedInputUser, {
            props,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        wrapper.unmount();
    });

    it("Проверка рендера", () => {
        expect(wrapper.find(".m-sel-input").exists()).toBe(true);
        expect(wrapper.findComponent({name: "MInput"}).exists()).toBe(true);
        expect(wrapper.findComponent({name: "SearchSVG"}).exists()).toBe(true);
    });

    it("Проверка связывания входного значения с v-model", async () => {
        const input = wrapper.findComponent({name: "MInput"});
        await input.setValue("Test User");

        expect(wrapper.vm.inputValue).toBe("Test User");
    });

    it("Вызов функции onSelectUser при нажатии на выбранного пользователя", async () => {
        await wrapper.setProps({
            selectUser: {userId: 0, name: ''},
        });

        wrapper.vm.resArray = [{userId: 1, name: "John Doe", email: "john@example.com"}];
        await wrapper.vm.$nextTick();

        const userElement = wrapper.find(".selected-element");
        expect(userElement.exists()).toBe(true);

        await userElement.trigger("click");
        await wrapper.vm.$nextTick();

        expect(mockSelectUser).toHaveBeenCalledWith({userId: 1, name: "John Doe"});
        expect(wrapper.vm.inputValue).toEqual('John Doe');
        expect(wrapper.vm.isFocus.wasFocus).toEqual(false);
        expect(Array.isArray(wrapper.vm.resArray)).toBe(true);
        expect(wrapper.vm.resArray).toEqual([]);
    });

    it("Проверка сброса значения при нажатии вне поля", async () => {
        wrapper.vm.isFocus.wasFocus = true;
        await wrapper.vm.handleClickOutside();

        expect(wrapper.vm.inputValue).toBe(props.selectUser.name);
        expect(wrapper.vm.resArray).toEqual([]);
        expect(wrapper.vm.isFocus.wasFocus).toBe(false);
    });

    it("Получение пользователей при изменении вводимого значения", async () => {
        const mockResponse = [{userId: 2, name: "Jane Doe", email: "jane@example.com"}];
        (SocketEmit.getUsersEmit as Mock).mockResolvedValue(mockResponse); // Используем default
        const input = wrapper.findComponent({name: "MInput"});
        await input.setValue("Jane");

        expect(SocketEmit.getUsersEmit).toHaveBeenCalledWith({query: "Jane"});
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.resArray).toEqual(mockResponse);
    });

    it("Обработка ошибки при получении пользователей", async () => {
        const mockError = new Error("Network error");
        (SocketEmit.getUsersEmit as Mock).mockRejectedValue(mockError); // Используем default

        const input = wrapper.findComponent({name: "MInput"});
        await input.setValue("Jane");

        await wrapper.vm.$nextTick();
        expect(setError).toHaveBeenCalledWith(mockError);
        expect(wrapper.vm.resArray).toEqual([]);
    });
});
