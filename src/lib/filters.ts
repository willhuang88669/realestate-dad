import { LISTINGS, type Listing, type ListingType, type PropertyType } from "@/data/listings";

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface Filters {
  areas: string[];
  propertyTypes: PropertyType[];
  minSize: number | null;
  maxSize: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  maxAge: number | null;
}

export const EMPTY_FILTERS: Filters = {
  areas: [],
  propertyTypes: [],
  minSize: null,
  maxSize: null,
  minPrice: null,
  maxPrice: null,
  maxAge: null,
};

export function countActiveFilters(filters: Filters): number {
  let n = 0;
  if (filters.areas.length) n++;
  if (filters.propertyTypes.length) n++;
  if (filters.minSize != null || filters.maxSize != null) n++;
  if (filters.minPrice != null || filters.maxPrice != null) n++;
  if (filters.maxAge != null) n++;
  return n;
}

export function applyFilters(
  type: ListingType,
  filters: Filters,
  mapBounds?: MapBounds | null,
  source: Listing[] = LISTINGS,
): Listing[] {
  return source.filter((l) => {
    if (l.type !== type) return false;
    if (filters.areas.length && !filters.areas.includes(l.area)) return false;
    if (
      filters.propertyTypes.length &&
      !filters.propertyTypes.includes(l.propertyType)
    )
      return false;
    if (filters.minSize != null && l.size < filters.minSize) return false;
    if (filters.maxSize != null && l.size > filters.maxSize) return false;
    if (filters.minPrice != null && l.price < filters.minPrice) return false;
    if (filters.maxPrice != null && l.price > filters.maxPrice) return false;
    if (filters.maxAge != null && l.age > filters.maxAge) return false;
    if (
      mapBounds &&
      (l.lat < mapBounds.south ||
        l.lat > mapBounds.north ||
        l.lng < mapBounds.west ||
        l.lng > mapBounds.east)
    )
      return false;
    return true;
  });
}
