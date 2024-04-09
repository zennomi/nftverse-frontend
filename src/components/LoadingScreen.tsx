import { Text } from "@react-three/uikit";
import { Card } from "./card";
import { Loading } from "./loading";
import { useProgress } from "@react-three/drei";
import { Fullscreen } from "./Fullscreen";

export default function LoadingScreen() {
    const { progress } = useProgress()
    return (
        <Fullscreen justifyContent="center" alignContent="center" alignItems="center">
            <Card borderRadius={32} padding={16} flexDirection="column" gapColumn={16} justifyContent="center" alignContent="center" alignItems="center">
                <Loading size="lg" />
                <Text fontSize={24}>Loading {Math.round(progress).toString()}%...</Text>
            </Card>
        </Fullscreen>
    )
}