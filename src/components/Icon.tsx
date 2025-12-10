/**
 * Icon Component
 * 
 * Thin-line style icons with consistent stroke width and rounded endpoints
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path, Circle, Line, Polyline, SvgProps } from 'react-native-svg';
import { colors } from '../designSystem/tokens';

export type IconName = 
  | 'search'
  | 'clear'
  | 'heart'
  | 'star'
  | 'plus'
  | 'minus'
  | 'arrow-left'
  | 'arrow-right'
  | 'home'
  | 'user'
  | 'shopping-cart'
  | 'filter'
  | 'location'
  | 'clock'
  | 'check'
  | 'x'
  | 'credit-card'
  | 'smartphone'
  | 'check-circle'
  | 'refresh-cw'
  | 'map'
  | 'list'
  | 'chevron-right'
  | 'edit-2'
  | 'phone'
  | 'truck'
  | 'log-out'
  | 'map-pin'
  | 'bell'
  | 'help-circle';

export type IconSize = 14 | 16 | 18 | 20 | 24 | 32 | 48;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
  testID?: string;
}

// Icon path definitions with thin-line style
const iconPaths: Record<IconName, (size: number) => React.ReactNode> = {
  search: (size) => (
    <>
      <Circle cx={size * 0.4} cy={size * 0.4} r={size * 0.25} fill="none" />
      <Path d={`m${size * 0.6} ${size * 0.6} ${size * 0.8} ${size * 0.8}`} />
    </>
  ),
  clear: (size) => (
    <>
      <Line x1={size * 0.25} y1={size * 0.25} x2={size * 0.75} y2={size * 0.75} />
      <Line x1={size * 0.75} y1={size * 0.25} x2={size * 0.25} y2={size * 0.75} />
    </>
  ),
  heart: (size) => (
    <Path 
      d={`M${size * 0.5} ${size * 0.8}c-${size * 0.15}-${size * 0.1}-${size * 0.4}-${size * 0.3}-${size * 0.4}-${size * 0.5}a${size * 0.15} ${size * 0.15} 0 0 1 ${size * 0.3} 0c0 ${size * 0.2} ${size * 0.25} ${size * 0.4} ${size * 0.4} ${size * 0.5}c${size * 0.15}-${size * 0.1} ${size * 0.4}-${size * 0.3} ${size * 0.4}-${size * 0.5}a${size * 0.15} ${size * 0.15} 0 0 1 ${size * 0.3} 0z`}
      fill="none"
    />
  ),
  star: (size) => (
    <Path 
      d={`M${size * 0.5} ${size * 0.15}l${size * 0.1} ${size * 0.2}h${size * 0.2}l-${size * 0.15} ${size * 0.15}l${size * 0.05} ${size * 0.2}-${size * 0.2}-${size * 0.15}-${size * 0.2} ${size * 0.15}l${size * 0.05}-${size * 0.2}-${size * 0.15}-${size * 0.15}h${size * 0.2}z`}
      fill="none"
    />
  ),
  plus: (size) => (
    <>
      <Line x1={size * 0.5} y1={size * 0.2} x2={size * 0.5} y2={size * 0.8} />
      <Line x1={size * 0.2} y1={size * 0.5} x2={size * 0.8} y2={size * 0.5} />
    </>
  ),
  minus: (size) => (
    <Line x1={size * 0.2} y1={size * 0.5} x2={size * 0.8} y2={size * 0.5} />
  ),
  'arrow-left': (size) => (
    <>
      <Line x1={size * 0.75} y1={size * 0.5} x2={size * 0.25} y2={size * 0.5} />
      <Polyline points={`${size * 0.4},${size * 0.35} ${size * 0.25},${size * 0.5} ${size * 0.4},${size * 0.65}`} fill="none" />
    </>
  ),
  'arrow-right': (size) => (
    <>
      <Line x1={size * 0.25} y1={size * 0.5} x2={size * 0.75} y2={size * 0.5} />
      <Polyline points={`${size * 0.6},${size * 0.35} ${size * 0.75},${size * 0.5} ${size * 0.6},${size * 0.65}`} fill="none" />
    </>
  ),
  home: (size) => (
    <>
      <Path d={`M${size * 0.2} ${size * 0.5}L${size * 0.5} ${size * 0.2}L${size * 0.8} ${size * 0.5}v${size * 0.3}H${size * 0.2}z`} fill="none" />
      <Path d={`M${size * 0.4} ${size * 0.8}v-${size * 0.2}h${size * 0.2}v${size * 0.2}`} fill="none" />
    </>
  ),
  user: (size) => (
    <>
      <Circle cx={size * 0.5} cy={size * 0.35} r={size * 0.15} fill="none" />
      <Path d={`M${size * 0.2} ${size * 0.8}c0-${size * 0.15} ${size * 0.15}-${size * 0.25} ${size * 0.3}-${size * 0.25}s${size * 0.3} ${size * 0.1} ${size * 0.3} ${size * 0.25}`} fill="none" />
    </>
  ),
  'shopping-cart': (size) => (
    <>
      <Circle cx={size * 0.3} cy={size * 0.75} r={size * 0.05} fill="none" />
      <Circle cx={size * 0.7} cy={size * 0.75} r={size * 0.05} fill="none" />
      <Path d={`M${size * 0.15} ${size * 0.25}h${size * 0.1}l${size * 0.1} ${size * 0.4}h${size * 0.5}l${size * 0.05}-${size * 0.25}H${size * 0.3}`} fill="none" />
    </>
  ),
  filter: (size) => (
    <>
      <Line x1={size * 0.2} y1={size * 0.3} x2={size * 0.8} y2={size * 0.3} />
      <Line x1={size * 0.3} y1={size * 0.5} x2={size * 0.7} y2={size * 0.5} />
      <Line x1={size * 0.4} y1={size * 0.7} x2={size * 0.6} y2={size * 0.7} />
    </>
  ),
  location: (size) => (
    <>
      <Path d={`M${size * 0.5} ${size * 0.8}s${size * 0.25}-${size * 0.2} ${size * 0.25}-${size * 0.4}a${size * 0.25} ${size * 0.25} 0 1 0-${size * 0.5} 0c0 ${size * 0.2} ${size * 0.25} ${size * 0.4} ${size * 0.25} ${size * 0.4}z`} fill="none" />
      <Circle cx={size * 0.5} cy={size * 0.4} r={size * 0.08} fill="none" />
    </>
  ),
  clock: (size) => (
    <>
      <Circle cx={size * 0.5} cy={size * 0.5} r={size * 0.3} fill="none" />
      <Line x1={size * 0.5} y1={size * 0.3} x2={size * 0.5} y2={size * 0.5} />
      <Line x1={size * 0.5} y1={size * 0.5} x2={size * 0.65} y2={size * 0.5} />
    </>
  ),
  check: (size) => (
    <Polyline points={`${size * 0.25},${size * 0.5} ${size * 0.45},${size * 0.65} ${size * 0.75},${size * 0.35}`} fill="none" />
  ),
  x: (size) => (
    <>
      <Line x1={size * 0.3} y1={size * 0.3} x2={size * 0.7} y2={size * 0.7} />
      <Line x1={size * 0.7} y1={size * 0.3} x2={size * 0.3} y2={size * 0.7} />
    </>
  ),
  'credit-card': (size) => (
    <>
      <Path d={`M${size * 0.15} ${size * 0.3}h${size * 0.7}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.05} ${size * 0.05}v${size * 0.3}a${size * 0.05} ${size * 0.05} 0 0 1-${size * 0.05} ${size * 0.05}H${size * 0.15}a${size * 0.05} ${size * 0.05} 0 0 1-${size * 0.05}-${size * 0.05}V${size * 0.35}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.05}-${size * 0.05}z`} fill="none" />
      <Line x1={size * 0.1} y1={size * 0.45} x2={size * 0.9} y2={size * 0.45} />
    </>
  ),
  smartphone: (size) => (
    <>
      <Path d={`M${size * 0.3} ${size * 0.15}h${size * 0.4}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.05} ${size * 0.05}v${size * 0.6}a${size * 0.05} ${size * 0.05} 0 0 1-${size * 0.05} ${size * 0.05}H${size * 0.3}a${size * 0.05} ${size * 0.05} 0 0 1-${size * 0.05}-${size * 0.05}V${size * 0.2}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.05}-${size * 0.05}z`} fill="none" />
      <Line x1={size * 0.45} y1={size * 0.75} x2={size * 0.55} y2={size * 0.75} />
    </>
  ),
  'check-circle': (size) => (
    <>
      <Circle cx={size * 0.5} cy={size * 0.5} r={size * 0.3} fill="none" />
      <Polyline points={`${size * 0.35},${size * 0.5} ${size * 0.45},${size * 0.6} ${size * 0.65},${size * 0.4}`} fill="none" />
    </>
  ),
  'refresh-cw': (size) => (
    <>
      <Path d={`M${size * 0.75} ${size * 0.35}A${size * 0.25} ${size * 0.25} 0 1 1 ${size * 0.35} ${size * 0.25}`} fill="none" />
      <Polyline points={`${size * 0.7},${size * 0.2} ${size * 0.75},${size * 0.35} ${size * 0.6},${size * 0.4}`} fill="none" />
    </>
  ),
  'map': (size) => (
    <>
      <Path d={`M${size * 0.2} ${size * 0.2}l${size * 0.15} ${size * 0.1}l${size * 0.3} -${size * 0.1}l${size * 0.15} ${size * 0.1}v${size * 0.5}l-${size * 0.15} -${size * 0.1}l-${size * 0.3} ${size * 0.1}l-${size * 0.15} -${size * 0.1}z`} fill="none" />
      <Line x1={size * 0.35} y1={size * 0.3} x2={size * 0.35} y2={size * 0.7} />
      <Line x1={size * 0.65} y1={size * 0.2} x2={size * 0.65} y2={size * 0.6} />
    </>
  ),
  'list': (size) => (
    <>
      <Line x1={size * 0.3} y1={size * 0.3} x2={size * 0.8} y2={size * 0.3} />
      <Line x1={size * 0.3} y1={size * 0.5} x2={size * 0.8} y2={size * 0.5} />
      <Line x1={size * 0.3} y1={size * 0.7} x2={size * 0.8} y2={size * 0.7} />
      <Circle cx={size * 0.2} cy={size * 0.3} r={size * 0.02} />
      <Circle cx={size * 0.2} cy={size * 0.5} r={size * 0.02} />
      <Circle cx={size * 0.2} cy={size * 0.7} r={size * 0.02} />
    </>
  ),
  'chevron-right': (size) => (
    <Polyline points={`${size * 0.4},${size * 0.3} ${size * 0.6},${size * 0.5} ${size * 0.4},${size * 0.7}`} fill="none" />
  ),
  'edit-2': (size) => (
    <>
      <Path d={`M${size * 0.6} ${size * 0.25}l${size * 0.15} ${size * 0.15}l-${size * 0.35} ${size * 0.35}H${size * 0.25}v-${size * 0.15}z`} fill="none" />
      <Path d={`M${size * 0.65} ${size * 0.2}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.1} 0l${size * 0.05} ${size * 0.05}a${size * 0.05} ${size * 0.05} 0 0 1 0 ${size * 0.1}l-${size * 0.05} ${size * 0.05}`} fill="none" />
    </>
  ),
  'phone': (size) => (
    <>
      <Path d={`M${size * 0.65} ${size * 0.75}c${size * 0.1} ${size * 0.1} ${size * 0.2} ${size * 0.05} ${size * 0.15} -${size * 0.05}l-${size * 0.1} -${size * 0.1}c-${size * 0.05} -${size * 0.05} -${size * 0.05} -${size * 0.1} 0 -${size * 0.15}l${size * 0.05} -${size * 0.1}c${size * 0.05} -${size * 0.1} ${size * 0.15} -${size * 0.1} ${size * 0.2} -${size * 0.05}l${size * 0.1} ${size * 0.1}c${size * 0.1} ${size * 0.05} ${size * 0.15} ${size * 0.15} ${size * 0.05} ${size * 0.25}z`} fill="none" />
    </>
  ),
  'truck': (size) => (
    <>
      <Path d={`M${size * 0.15} ${size * 0.4}h${size * 0.4}v${size * 0.25}H${size * 0.15}z`} fill="none" />
      <Path d={`M${size * 0.55} ${size * 0.5}h${size * 0.15}l${size * 0.1} -${size * 0.1}v-${size * 0.1}h-${size * 0.25}z`} fill="none" />
      <Circle cx={size * 0.25} cy={size * 0.75} r={size * 0.05} fill="none" />
      <Circle cx={size * 0.65} cy={size * 0.75} r={size * 0.05} fill="none" />
    </>
  ),
  'log-out': (size) => (
    <>
      <Path d={`M${size * 0.4} ${size * 0.2}h${size * 0.3}a${size * 0.05} ${size * 0.05} 0 0 1 ${size * 0.05} ${size * 0.05}v${size * 0.5}a${size * 0.05} ${size * 0.05} 0 0 1 -${size * 0.05} ${size * 0.05}H${size * 0.4}`} fill="none" />
      <Line x1={size * 0.2} y1={size * 0.5} x2={size * 0.4} y2={size * 0.5} />
      <Polyline points={`${size * 0.25},${size * 0.4} ${size * 0.2},${size * 0.5} ${size * 0.25},${size * 0.6}`} fill="none" />
    </>
  ),
  'map-pin': (size) => (
    <>
      <Path d={`M${size * 0.5} ${size * 0.8}s${size * 0.25}-${size * 0.2} ${size * 0.25}-${size * 0.4}a${size * 0.25} ${size * 0.25} 0 1 0-${size * 0.5} 0c0 ${size * 0.2} ${size * 0.25} ${size * 0.4} ${size * 0.25} ${size * 0.4}z`} fill="none" />
      <Circle cx={size * 0.5} cy={size * 0.4} r={size * 0.08} fill="none" />
    </>
  ),
  'bell': (size) => (
    <>
      <Path d={`M${size * 0.3} ${size * 0.6}a${size * 0.2} ${size * 0.2} 0 0 0 ${size * 0.4} 0`} fill="none" />
      <Path d={`M${size * 0.5} ${size * 0.2}a${size * 0.15} ${size * 0.15} 0 0 1 ${size * 0.15} ${size * 0.15}v${size * 0.25}a${size * 0.15} ${size * 0.15} 0 0 1 -${size * 0.3} 0V${size * 0.35}a${size * 0.15} ${size * 0.15} 0 0 1 ${size * 0.15} -${size * 0.15}z`} fill="none" />
      <Line x1={size * 0.5} y1={size * 0.2} x2={size * 0.5} y2={size * 0.15} />
    </>
  ),
  'help-circle': (size) => (
    <>
      <Circle cx={size * 0.5} cy={size * 0.5} r={size * 0.3} fill="none" />
      <Path d={`M${size * 0.4} ${size * 0.4}a${size * 0.1} ${size * 0.1} 0 0 1 ${size * 0.2} 0c0 ${size * 0.05} -${size * 0.05} ${size * 0.1} -${size * 0.1} ${size * 0.1}`} fill="none" />
      <Circle cx={size * 0.5} cy={size * 0.65} r={size * 0.02} />
    </>
  ),
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.text.primary,
  strokeWidth = 1.5,
  style,
  testID,
}) => {
  const iconContent = iconPaths[name]?.(size);

  if (!iconContent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <View 
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      testID={testID}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {iconContent}
      </Svg>
    </View>
  );
};