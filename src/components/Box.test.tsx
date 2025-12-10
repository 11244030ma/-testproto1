/**
 * Box Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Box } from './Box';
import { spacing, colors, borderRadius, shadows } from '../designSystem/tokens';

// Helper to extract style from component (handles array or object)
const getStyle = (component: any) => {
  const style = component.props.style;
  return Array.isArray(style) ? style[0] : style;
};

describe('Box Component', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Box>
        <Text>Test Content</Text>
      </Box>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should apply spacing from design tokens', () => {
    const { getByTestId } = render(
      <Box padding="lg" margin="md" testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      padding: spacing.lg,
      margin: spacing.md,
    });
  });

  it('should apply numeric spacing values', () => {
    const { getByTestId } = render(
      <Box padding={20} margin={10} testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      padding: 20,
      margin: 10,
    });
  });

  it('should apply layout props', () => {
    const { getByTestId } = render(
      <Box 
        flex={1} 
        flexDirection="row" 
        justifyContent="center" 
        alignItems="center"
        testID="box"
      >
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });

  it('should apply background color', () => {
    const { getByTestId } = render(
      <Box backgroundColor={colors.background.primary} testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      backgroundColor: colors.background.primary,
    });
  });

  it('should apply border radius from design tokens', () => {
    const { getByTestId } = render(
      <Box borderRadius="medium" testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      borderRadius: borderRadius.medium,
    });
  });

  it('should apply numeric border radius', () => {
    const { getByTestId } = render(
      <Box borderRadius={20} testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      borderRadius: 20,
    });
  });

  it('should apply shadow from design tokens', () => {
    const { getByTestId } = render(
      <Box shadow="low" testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject(shadows.low);
  });

  it('should apply dimensions', () => {
    const { getByTestId } = render(
      <Box width={100} height={200} testID="box">
        <Text>Content</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      width: 100,
      height: 200,
    });
  });

  it('should merge custom style prop', () => {
    const { getByTestId } = render(
      <Box 
        padding="lg" 
        style={{ opacity: 0.5 }} 
        testID="box"
      >
        <Text>Content</Text>
      </Box>
    );
    
    const box = getByTestId('box');
    const styles = box.props.style;
    // Check both styles are present in the array
    expect(styles[0]).toMatchObject({ padding: spacing.lg });
    expect(styles[1]).toMatchObject({ opacity: 0.5 });
  });

  it('should apply gap for flex layouts', () => {
    const { getByTestId } = render(
      <Box flexDirection="row" gap="md" testID="box">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </Box>
    );
    
    const style = getStyle(getByTestId('box'));
    expect(style).toMatchObject({
      gap: spacing.md,
    });
  });
});
