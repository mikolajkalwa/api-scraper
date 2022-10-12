const fastify = require('fastify')({ logger: true })
const { faker } = require('@faker-js/faker')

const products = []

for (let i = 0; i < 500_000; i++) {
  products.push({
    id: faker.datatype.uuid(),
    price: Number.parseFloat(faker.commerce.price(1, 100000)),
    name: faker.commerce.productName()
  })
}

products.sort((a, b) => a.price - b.price) // sorts by price, from cheapest to most expensive

fastify.get('/products', async (request, reply) => {
  const minPrice = Number.parseFloat(request.query.minPrice) || 0
  const maxPrice = Number.parseFloat(request.query.maxPrice) || 100_000

  const productsChunk = products.filter(product => product.price >= minPrice && product.price <= maxPrice)
  const productsChunkToSend = productsChunk.slice(0, 1000)
  return {
    total: productsChunk.length,
    count: productsChunkToSend.length,
    products: productsChunkToSend
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
