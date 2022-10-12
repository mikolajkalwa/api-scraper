import { request } from 'undici';
import type { EcommerceResponse, Product } from './scraper.types';

export default class Scraper {
  readonly #baseUrl: string;

  readonly #minPrice: number;
  readonly #maxPrice: number;

  constructor(baseUrl: string, minPrice = 0, maxPrice = 100000) {
    this.#baseUrl = baseUrl;
    this.#minPrice = minPrice;
    this.#maxPrice = maxPrice;
  }

  async #fetchChunk(minPrice: number, maxPrice: number): Promise<EcommerceResponse> {
    const respose = await request(`${this.#baseUrl}/products?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    const body = await respose.body.json() as EcommerceResponse;
    console.log('Fetched chunk:', {
      minPrice, maxPrice, total: body.total, count: body.count,
    });
    return body;
  }

  async getAllProducts(): Promise<Product[]> {
    // Map guarantees uniqueness in returned array
    const allProducts = new Map<number | string, Product>();

    const firstChunk = await this.#fetchChunk(this.#minPrice, this.#maxPrice);
    // Save downloaded products into the map
    firstChunk.products.forEach((product) => {
      allProducts.set(product.id, product);
    });

    // Download next chunks
    // Provide price of the most expensive product from previous chunk as a minPrice
    // Assumes that API returns products sorted ascending by price
    // Assumes each product have it's own unique id
    // Using Map structure to avoid storing duplicates, as "chunks" could be overlapping
    let priceToStart = firstChunk.products.at(-1)?.price ?? this.#maxPrice; // nullish coalescing operator to handle edge-case of chunk being empty
    let chunk;
    while (priceToStart !== this.#maxPrice) { // Reached most expensive products, not possible to fetch more
      chunk = await this.#fetchChunk(priceToStart, this.#maxPrice);
      chunk.products.forEach((product) => {
        allProducts.set(product.id, product);
      });
      priceToStart = chunk.products.at(-1)?.price ?? this.#maxPrice;
    }

    return Array.from(allProducts.values());
  }
}
