# API Scraping
Script to extract all products from provided API.

### How to run:
Docker is the easiest way: `docker run --rm ghcr.io/mikolajkalwa/api-scraper`

By default targets https://api.ecommerce.com however it can be configured via `BASE_URL` environment variable.

### Additional assumptions about given API
* Products are sorted by price in ascending order
* There can't be 1000 or more products with the same price
