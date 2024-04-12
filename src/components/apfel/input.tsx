import { computed } from '@preact/signals-core'
import { GlassMaterial, colors } from './theme'
import { Input as InputImpl, Container, DefaultProperties, Text, InputInternals } from '@react-three/uikit'
import React, { ComponentPropsWithoutRef, ReactNode, useMemo, useState } from 'react'

type Variant = 'pill' | 'rect'

//TODO: increase hitbox size (by increasing the size of the InputImpl)

export function Input({
  variant = 'rect',
  prefix,
  placeholder,
  panelMaterialClass,
  multiline,
  value,
  defaultValue,
  onValueChange,
  tabIndex,
  disabled = false,
  fontSize,
  ...props
}: ComponentPropsWithoutRef<typeof InputImpl> & { placeholder?: string; variant?: Variant; prefix?: ReactNode }) {
  const [internal, setInternal] = useState<InputInternals | null>(null)
  const placeholderOpacity = useMemo(() => {
    if (internal == null) {
      return undefined
    }
    return computed(() => (internal.current.value.length > 0 ? 0 : undefined))
  }, [internal])

  return (
    <Container
      height={20}
      width="100%"
      paddingRight={5}
      paddingLeft={prefix ? 0 : 5}
      flexDirection="row"
      alignItems="center"
      borderRadius={variant === 'pill' ? 5 : 3}
      backgroundColor="#444"
      backgroundOpacity={disabled ? 0.3 : 0.4}
      borderOpacity={disabled ? 0.3 : 0.4}
      hover={disabled ? undefined : { backgroundOpacity: 0.2, borderOpacity: 0.2 }}
      border={2}
      borderColor="#444"
      borderBend={disabled ? 0 : -0.3}
      panelMaterialClass={GlassMaterial}
      overflow="hidden"
      {...props}
    >
      <DefaultProperties color={colors.foreground} opacity={disabled ? 0.2 : 0.5}>
        {prefix && (
          <Container flexShrink={0} paddingX={3}>
            <DefaultProperties width={3} height={3}>
              {prefix}
            </DefaultProperties>
          </Container>
        )}
        <Container alignItems="center" minHeight={1} flexGrow={1} positionType="relative">
          {placeholder != null && (
            <Text fontSize={fontSize} positionType="absolute" opacity={placeholderOpacity}>
              {placeholder}
            </Text>
          )}
          <InputImpl
            ref={setInternal}
            height="100%"
            width="100%"
            verticalAlign="center"
            fontSize={fontSize}
            panelMaterialClass={panelMaterialClass}
            multiline={multiline}
            value={value}
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            tabIndex={tabIndex}
            disabled={disabled}
          />
        </Container>
      </DefaultProperties>
    </Container>
  )
}
