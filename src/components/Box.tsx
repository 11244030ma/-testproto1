/**
 * Box Component
 * 
 * A flexible container component that supports all design token values
 * for spacing, layout, and styling
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, DimensionValue } from 'react-native';
import { spacing, colors, borderRadius, shadows } from '../designSystem/tokens';

type SpacingKey = keyof typeof spacing;
type ColorKey = string;
type BorderRadiusKey = keyof typeof borderRadius;
type ShadowKey = keyof typeof shadows;

export interface BoxProps {
  children?: React.ReactNode;
  
  // Spacing
  padding?: SpacingKey | number;
  paddingHorizontal?: SpacingKey | number;
  paddingVertical?: SpacingKey | number;
  paddingTop?: SpacingKey | number;
  paddingBottom?: SpacingKey | number;
  paddingLeft?: SpacingKey | number;
  paddingRight?: SpacingKey | number;
  
  margin?: SpacingKey | number;
  marginHorizontal?: SpacingKey | number;
  marginVertical?: SpacingKey | number;
  marginTop?: SpacingKey | number;
  marginBottom?: SpacingKey | number;
  marginLeft?: SpacingKey | number;
  marginRight?: SpacingKey | number;
  
  // Layout
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: SpacingKey | number;
  
  // Dimensions
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: DimensionValue;
  minHeight?: DimensionValue;
  maxWidth?: DimensionValue;
  maxHeight?: DimensionValue;
  
  // Styling
  backgroundColor?: ColorKey;
  borderRadius?: BorderRadiusKey | number;
  shadow?: ShadowKey;
  
  // Additional style
  style?: ViewStyle;
  
  // Accessibility
  testID?: string;
}

const getSpacingValue = (value: SpacingKey | number | undefined): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return spacing[value];
};

export const Box: React.FC<BoxProps> = ({
  children,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  gap,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  backgroundColor,
  borderRadius: borderRadiusProp,
  shadow,
  style,
  testID,
}) => {
  const boxStyle: ViewStyle = {
    // Spacing
    padding: getSpacingValue(padding),
    paddingHorizontal: getSpacingValue(paddingHorizontal),
    paddingVertical: getSpacingValue(paddingVertical),
    paddingTop: getSpacingValue(paddingTop),
    paddingBottom: getSpacingValue(paddingBottom),
    paddingLeft: getSpacingValue(paddingLeft),
    paddingRight: getSpacingValue(paddingRight),
    
    margin: getSpacingValue(margin),
    marginHorizontal: getSpacingValue(marginHorizontal),
    marginVertical: getSpacingValue(marginVertical),
    marginTop: getSpacingValue(marginTop),
    marginBottom: getSpacingValue(marginBottom),
    marginLeft: getSpacingValue(marginLeft),
    marginRight: getSpacingValue(marginRight),
    
    // Layout
    flex,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap: getSpacingValue(gap),
    
    // Dimensions
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    
    // Styling
    backgroundColor,
    borderRadius: typeof borderRadiusProp === 'number' 
      ? borderRadiusProp 
      : borderRadiusProp 
        ? borderRadius[borderRadiusProp] 
        : undefined,
    
    // Shadow
    ...(shadow ? shadows[shadow] : {}),
  };

  return (
    <View style={[boxStyle, style]} testID={testID}>
      {children}
    </View>
  );
};
