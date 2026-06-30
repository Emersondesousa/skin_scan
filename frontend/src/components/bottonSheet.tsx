import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Text, View } from 'react-native';

export default function BottonOptions() {
    const bottonSheetref = useRef(null)
    const snapPoints = useMemo(() => ["30%", "80%"], [])

    return (
        <View style={{flex: 1}}>
            <BottomSheet ref={bottonSheetref}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: "#fff" }}
            enablePanDownToClose={true}>
                <View style={{padding: 20}}>
                    <Text>Conteúdo BottonSheet</Text>
                </View>
            </BottomSheet>
        </View>
    )
}