const product = require("../models/product");

const getAllproductsStatic = async (req, res) => {
  const products = await product
    .find({ price: { $gt: 30 } })
    .sort("name")
    .select("name price");

  res.status(200).json({ products, nbhit: products.length });
};

const getAllproducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericfilters } = req.query;
  const querObject = {};

  if (featured) {
    querObject.featured = featured === "true" ? true : false;
  }

  if (company) {
    querObject.company = company;
  }

  if (name) {
    querObject.name = { $regex: name, $options: "i" };
  }

  if (numericfilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericfilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    
    filters = filters.split(',').forEach((item)=> {
      const [field, operator, value ]= item.split('-')

      if(options.includes(field)) {
        querObject[field] = {[operator]:Number(value)}
      }
    });
  }


  console.log(querObject);
  let result = product.find(querObject)
  //sort
  if (sort) {
    const sortlist = sort.split(",").join(" ");
    result = result.sort(sortlist);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldlist = fields.split(",").join(" ");
    result = result.select(fieldlist);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbhit: products.length });
};

module.exports = {
  getAllproducts,
  getAllproductsStatic,
};
