import 'dotenv/config';
import Scraper from './scraper/scraper';

async function main() {
  const scraper = new Scraper(process.env['BASE_URL'] ?? 'https://api.ecommerce.com');
  const products = await scraper.getAllProducts();
  console.log('All products count:', products.length);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
