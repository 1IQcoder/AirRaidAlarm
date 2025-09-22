import { SnackbarList as SnackbarListType } from "@/hooks/useSnackbarList";
import React, { useState } from "react";
import { View } from "react-native";
import { Portal, Snackbar } from "react-native-paper";

type SnackbarListProps = {
    snackbars: SnackbarListType,
    deleteSnackbar: (id: number) => void;
}

export const SnackbarList: React.FC<SnackbarListProps> = ({ snackbars, deleteSnackbar }) => {
    const [offset, setOffset] = useState(20);

    const deleteSnackbar1 = (id: number) => {
        setOffset(offset-20)
        deleteSnackbar(id);
    }

    return (
        <Portal>
            {Object.values(snackbars)
                .sort((a, b) => a.id - b.id)
                .map(sb => (
                    <Snackbar
                        key={sb.id}
                        visible={true}
                        onDismiss={()=>{}}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                deleteSnackbar1(sb.id);
                            },
                        }}>
                        {String(sb.msg)}
                    </Snackbar>
                ))
            }
        </Portal>
    )
}