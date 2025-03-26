/**
 * Utility functions for handling pagination in the profile page
 */

/**
 * Get paginated items from a data array
 * @param data The full array of data items
 * @param page Current page number (1-based)
 * @param itemsPerPage Number of items per page
 * @returns Paginated array of items for the current page
 */
export function getPaginatedItems<T>(
  data: T[] | undefined,
  page: number,
  itemsPerPage: number
): T[] {
  if (!data || !Array.isArray(data)) return [];
  return data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
}

/**
 * Calculate total number of pages
 * @param totalItems Total number of items
 * @param itemsPerPage Number of items per page
 * @returns Total number of pages
 */
export function getTotalPages(
  totalItems: number,
  itemsPerPage: number
): number {
  return Math.ceil(totalItems / itemsPerPage);
}
