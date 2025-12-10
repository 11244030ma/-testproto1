/**
 * Text Component
 * 
 * Typography component with design system variants
 */

import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { typography, colors } from '../designSystem/tokens';

type TypographyVariant = 'heading1' | 'heading2' | 'heading3' | 'subheading' | 'body' | 'caption';
type FontWeight = keyof typeof typography.fontWeight;
type TextColor = string;

export interface TextProps extends Omit<RNTextProps, 'style'> {
  children: React.ReactNode;
  variant?: TypographyVariant;
  weight?: FontWeight;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  testID?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'regular',
  color = colors.text.primary,
  align = 'left',
  style,
  testID,
  ...props
}) => {
  const textStyle: TextStyle = {
    fontFamily: variant.startsWith('heading') 
      ? typography.fontFamily.heading 
      : typography.fontFamily.body,
    fontSize: typography.fontSize[variant],
    fontWeight: typography.fontWeight[weight],
    lineHeight: variant === 'body' || variant === 'caption' 
      ? typography.fontSize[variant] * typography.lineHeight.normal
      : typography.fontSize[variant] * typography.lineHeight.tight,
    color,
    textAlign: align,
  };

  return (
    <RNText style={[textStyle, style]} testID={testID} {...props}>
      {children}
    </RNText>
  );
};