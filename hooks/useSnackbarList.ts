import { useState } from "react";

type Snackbar = {
    id: number,
    msg: string,
}

export type SnackbarList = Record<number, Snackbar>;

export const useSnackbarList = () => {
    const [snackbars, setSnackbars] = useState<SnackbarList>({});
    const [id, setId] = useState(0);

    const showSnackbar = (msg: string, time?: number) => {
        setId(id+1);
        const newMsg: Snackbar = {
            id: id,
            msg: msg,
        }
        setSnackbars(prev => ({ ...prev, [newMsg.id]: newMsg }));

        setTimeout(() => {
            deleteSnackbar(newMsg.id);
        }, time ?? 3000);
    }

    const deleteSnackbar = (id: number) => {
        setSnackbars(prev => {
            const copy = { ...prev };
            delete copy[id]
            return copy;
        })
    }

    return {
        snackbars,
        showSnackbar,
        deleteSnackbar,
    }
}

type UseSnackbarReturn = ReturnType<typeof useSnackbarList>;
export type ShowSnackbarFn = UseSnackbarReturn["showSnackbar"];