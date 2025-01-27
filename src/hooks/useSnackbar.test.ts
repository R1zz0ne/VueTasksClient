import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {useSnackbar} from "./useSnackbar.ts";

vi.useFakeTimers();

describe('useSnackbar', () => {
    let snackbar: ReturnType<typeof useSnackbar>
    const timer = 3000;

    beforeEach(() => {
        snackbar = useSnackbar(timer);
    })

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    })

    it('Проверка инициализации', () => {
        expect(snackbar.show.value).toBe(false);
    })

    it('Проверка установки show = false после истечения таймера', () => {
        expect(snackbar.show.value).toBe(false);
        snackbar.showSnackBar();
        expect(snackbar.show.value).toBe(true);

        vi.advanceTimersByTime(timer - 1); // Продвигаем время на (timer - 1) миллисекунду (остается 1мс)
        expect(snackbar.show.value).toBe(true);

        vi.advanceTimersByTime(1); //Двигаем таймер еще на 1мс
        expect(snackbar.show.value).toBe(false);
    })

    it('Проверка установкии show = false при вызове функции  closeSnackBar', () => {
        snackbar.showSnackBar();
        expect(snackbar.show.value).toBe(true);
        snackbar.closeSnackBar();
        expect(snackbar.show.value).toBe(false);
    })

    it('Проверка сброса таймера', () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

        snackbar.showSnackBar();
        snackbar.closeSnackBar();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(snackbar.show.value).toBe(false);

        clearTimeoutSpy.mockRestore();
    });

    it('Проверка повторного вызова', () => {
        snackbar.showSnackBar();
        vi.advanceTimersByTime(timer / 2); //Продвигаем время на половину таймера
        expect(snackbar.show.value).toBe(true);

        snackbar.showSnackBar();
        vi.advanceTimersByTime(timer / 2); //Еще половина таймера
        expect(snackbar.show.value).toBe(true);

        vi.advanceTimersByTime(timer / 2); //таймер полность истёк
        expect(snackbar.show.value).toBe(false);
    })
})