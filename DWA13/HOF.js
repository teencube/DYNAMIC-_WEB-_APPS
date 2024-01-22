const provinces = ['Western Cape', 'Gauteng', 'Northern Cape', 'Eastern Cape', 'KwaZulu-Natal', 'Free State'];

const names = ['Ashwin', 'Sibongile', 'Jan-Hendrik', 'Sifso', 'Shailen', 'Frikkie'];


//  1: forEach to console log each name
names.forEach(name => console.log(name));

// 2: forEach to console log each name with matching province
names.forEach((name, index) => console.log(`${name} (${provinces[index]})`));

// 3: map to convert province names to uppercase
const uppercaseProvinces = provinces.map(province => province.toUpperCase());
console.log(uppercaseProvinces);

// 4: map to create an array with the amount of characters in each name
const charactersInNames = names.map(name => name.length);
console.log(charactersInNames);

//5: sort provinces alphabetically using sort
const sortedProvinces = provinces.slice().sort();
console.log(sortedProvinces);

//  6: filter to remove provinces with the word "Cape" and return the count
const filteredProvinces = provinces.filter(province => !province.includes('Cape'));
console.log(filteredProvinces.length);

//  7: map and some to create a boolean array if a name contains 'S'
const hasSCharacter = names.map(name => name.split('').some(char => char === 'S'));
console.log(hasSCharacter);

//  8: reduce to create an object mapping names to provinces
const nameProvinceMap = names.reduce((acc, name, index) => {
  acc[name] = provinces[index];
  return acc;
}, {});
console.log(nameProvinceMap);





 