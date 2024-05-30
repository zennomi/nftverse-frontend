import { Text } from "@react-three/uikit";
import { Card } from "./apfel/card";
import { Loading } from "./apfel/loading";
import { Fullscreen, FullscreenProperties } from "./override/Fullscreen";

export default function LoadingScreen({ text, ...props }: { text?: string } & FullscreenProperties) {
    return (
        <Fullscreen justifyContent="center" alignContent="center" alignItems="center" {...props}>
            <Card borderRadius={16} padding={16} flexDirection="column" gapColumn={16} justifyContent="center" alignContent="center" alignItems="center">
                <Loading size="lg" />
                <Text fontSize={24}>{text || "Loading..."}</Text>
            </Card>
        </Fullscreen>
    )
}