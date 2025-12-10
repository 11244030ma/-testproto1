/**
 * Skeleton Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Skeleton } from './Skeleton';
import { ThemeProvider } from '../designSystem/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Skeleton', () => {
  it('should render with default props', () => {
    const { getByTestId } = renderWithTheme(
      <Skeleton testID="skeleton" />
    );
    
    expect(getByTestId('skeleton')).toBeTruthy();
  });

  it('should render with custom dimensions', () => {
    const { getByTestId } = renderWithTheme(
      <Skeleton 
        width={200} 
        height={50} 
        testID="skeleton" 
      />
    );
    
    const skeleton = getByTestId('skeleton');
    expect(skeleton).toBeTruthy();
    expect(skeleton.props.style[0]).toMatchObject({
      width: 200,
      height: 50,
    });
  });

  it('should render with custom border radius', () => {
    const { getByTestId } = renderWithTheme(
      <Skeleton 
        borderRadius="medium" 
        testID="skeleton" 
      />
    );
    
    const skeleton = getByTestId('skeleton');
    expect(skeleton).toBeTruthy();
    expect(skeleton.props.style[0].borderRadius).toBe(16); // medium border radius
  });

  it('should render with numeric border radius', () => {
    const { getByTestId } = renderWithTheme(
      <Skeleton 
        borderRadius={10} 
        testID="skeleton" 
      />
    );
    
    const skeleton = getByTestId('skeleton');
    expect(skeleton).toBeTruthy();
    expect(skeleton.props.style[0].borderRadius).toBe(10);
  });
});