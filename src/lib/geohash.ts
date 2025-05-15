import ngeohash from 'ngeohash';

/**
 * Encode a pair of latitude and longitude values into a geohash.
 * @param latitude - The latitude to encode
 * @param longitude - The longitude to encode
 * @param precision - The precision of the hash (default: 9)
 * @returns The geohash string
 */
export function encode(latitude: number, longitude: number, precision: number = 9): string {
  return ngeohash.encode(latitude, longitude, precision);
}

/**
 * Decode a hash string into pair of latitude and longitude values.
 * @param hashstring - The geohash string to decode
 * @returns An object with latitude and longitude keys
 */
export function decode(hashstring: string): { latitude: number; longitude: number } {
  return ngeohash.decode(hashstring);
}

/**
 * Decode hashstring into a bounding box that matches it.
 * @param hashstring - The geohash string to decode
 * @returns A four-element array: [minlat, minlon, maxlat, maxlon]
 */
export function decode_bbox(hashstring: string): [number, number, number, number] {
  return ngeohash.decode_bbox(hashstring) as [number, number, number, number];
}

/**
 * Get all hashstrings between [minlat, minlon] and [maxlat, maxlon].
 * @param minlat - Minimum latitude of the bounding box
 * @param minlon - Minimum longitude of the bounding box
 * @param maxlat - Maximum latitude of the bounding box
 * @param maxlon - Maximum longitude of the bounding box
 * @param precision - The precision of the hash (default: 9)
 * @returns Array of geohash strings
 */
export function bboxes(minlat: number, minlon: number, maxlat: number, maxlon: number, precision: number = 9): string[] {
  return ngeohash.bboxes(minlat, minlon, maxlat, maxlon, precision);
}

/**
 * Find the neighbor of a geohash string in certain direction.
 * @param hashstring - The geohash string
 * @param direction - A two-element array representing direction, e.g. [1,0] means north, [-1,-1] means southwest
 * @returns The neighboring geohash string
 */
export function neighbor(hashstring: string, direction: [number, number]): string {
  return ngeohash.neighbor(hashstring, direction);
}

/**
 * Find all 8 geohash neighbors of a geohash string.
 * @param hashstring - The geohash string
 * @returns Array of neighboring geohash strings in order: [n, ne, e, se, s, sw, w, nw]
 */
export function neighbors(hashstring: string): string[] {
  return ngeohash.neighbors(hashstring);
}


