

const products = [
  { product: 'banana', price: "2" },
  { product: 'mango', price: 6 },
  { product: 'potato', price: ' ' },
  { product: 'avocado', price: "8" },
  { product: 'coffee', price: 10 },
  { product: 'tea', price: '' },
];

// 1. Use forEach to console.log each product name to the console.

products.forEach(product => console.log(product.product));

// 2. Use filter to filter out products that have a name longer than 5 characters.

const filteredProducts = products.filter(product => product.product.length <= 5);
console.log(filteredProducts);

// 3. Using both filter and map. Convert all prices that are strings to numbers, and remove all products without prices.
// After this has been done, use reduce to calculate the combined price of all remaining products.
const combinedPrice = products
  .filter(product => product.price !== '' && !isNaN(product.price))
  .map(product => Number(product.price))
  .reduce((acc, price) => acc + price, 0);
console.log(combinedPrice);

// 4. Use reduce to concatenate all product names to create the following string: banana, mango, potato, avocado, coffee, and tea.

const concatenatedNames = products.reduce((acc, product) => {
  if (acc === '') {
    return product.product;
  } else {
    return `${acc}, ${product.product}`;
  }
}, '');
console.log(concatenatedNames);

// 5. Use reduce to calculate both the highest and lowest-priced items.
// The names should be returned as the following string: Highest: coffee. Lowest: banana.

const priceStats = products.reduce((acc, product) => {
  const price = Number(product.price);
  if (isNaN(price)) return acc;

  if (acc.highest === undefined || price > acc.highest.price) {
    acc.highest = { price, name: product.product };
  }

  if (acc.lowest === undefined || price < acc.lowest.price) {
    acc.lowest = { price, name: product.product };
  }

  return acc;
}, {});
console.log(`Highest: ${priceStats.highest.name}. Lowest: ${priceStats.lowest.name}`);

// 6. Using only Object.entries and reduce, recreate the object with the exact same values.
// However, the following object keys should be changed in the new array:
// product should be changed to name, price should be changed to cost.

const transformedProducts = Object.entries(products).reduce((acc, [key, value]) => {
  const transformedKey = key === 'product' ? 'name' : key === 'price' ? 'cost' : key;
  acc[transformedKey] = value;
  return acc;
}, {});
console.log(transformedProducts);
