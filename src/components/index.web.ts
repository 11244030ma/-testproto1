// Web-specific exports that replace native modules
export * from './Box';
export * from './Text';
export * from './Button';
export * from './Card';
export * from './Input';
export * from './Icon';
export * from './RestaurantCard';
export * from './MenuItem';
export * from './MenuItemDetail';
export * from './SearchBar';
export * from './FilterPill';
export * from './EmptyState';
export * from './AddToCartConfirmation';
export * from './Skeleton';
export * from './RestaurantCardSkeleton';
export * from './SearchBarSkeleton';
export * from './FilterPillSkeleton';
export * from './HomeScreenSkeleton';
export * from './ErrorBanner';
export * from './AddressAutocomplete';
export * from './AddPaymentMethodModal';
export * from './ViewToggle';

// Web-compatible versions
export { RestaurantMapView } from './MapView.web';
export { FloatingSearchBar } from './FloatingSearchBar.web';

// Re-export ViewMode type
export type { ViewMode } from './ViewToggle';