import { getInputSourceId } from "@coconut-xr/natuerlich";
import { PointerController, TouchHand } from "@coconut-xr/natuerlich/defaults";
import {
    ImmersiveSessionOrigin,
    useInputSources,
} from "@coconut-xr/natuerlich/react";

function ImmersiveSession() {
    const inputSources = useInputSources();

    return (
        <ImmersiveSessionOrigin position={[0, -0.9, 0]}>
            {inputSources.map((inputSource) =>
                inputSource.hand != null ? (
                    <TouchHand
                        cursorOpacity={1}
                        key={getInputSourceId(inputSource)}
                        id={getInputSourceId(inputSource)}
                        inputSource={inputSource}
                        hand={inputSource.hand}
                    />
                ) : (
                    <PointerController
                        key={getInputSourceId(inputSource)}
                        id={getInputSourceId(inputSource)}
                        inputSource={inputSource}
                    />
                ),
            )}
        </ImmersiveSessionOrigin>
    );
}

export default ImmersiveSession;
