import { Container, ContainerProperties, Text } from "@react-three/uikit"
import { Delete } from "@react-three/uikit-lucide"
import { Button } from "./apfel/button"

export default function Numpad({ value, onValueChange, ...props }: { value: string, onValueChange: (_: string) => void, } & ContainerProperties) {
    const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",]

    return (
        <Container {...props}>
            <Container flexDirection="row" flexWrap="wrap">
                {
                    values.map(number => (
                        <Container width="33%" justifyContent="center" padding={4}>
                            <Button justifyContent="center" key={number} variant="icon" onClick={() => { onValueChange(value + number) }} platter>
                                <Text textAlign="center">{number}</Text>
                            </Button>
                        </Container>
                    ))
                }
                <Container width="33%" justifyContent="center" padding={4}>
                    <Button justifyContent="center" variant="icon" onClick={() => { onValueChange(value.slice(0, value.length - 1)) }} disabled={value.length === 0} platter>
                        <Delete />
                    </Button>
                </Container>
            </Container>
        </Container>
    )
}