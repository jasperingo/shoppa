const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const AddressRepository = require("../repository/AddressRepository");
const DiscountProductRepository = require("../repository/DiscountProductRepository");
const ProductVariantRepository = require("../repository/ProductVariantRepository");
const RouteDurationRepository = require("../repository/RouteDurationRepository");
const RouteRepository = require("../repository/RouteRepository");
const RouteWeightRepository = require("../repository/RouteWeightRepository");
const StoreRepository = require("../repository/StoreRepository");


module.exports = class OrderController {

  async create(req, res, next) {
    res.send({ i:9 });
  }

  async getRouteSuggestions(req, res, next) {
    
    try {

      const data = req.body;

      const customerAddress = await AddressRepository.get(data.customer_address_id);

      const storeAddress = (await StoreRepository.get(data.store_id)).user.addresses[0];

      const routes = await RouteRepository.getListByCityAndState(customerAddress.state, storeAddress.state, customerAddress.city, storeAddress.city);

      for (let i=0; i<routes.length; i++) {

        let weights = [];

        for (let item of data.order_items) {

          const routeWeight = await RouteWeightRepository.getByRouteAndWeight(routes[i].id, item.weight);

          if (routeWeight === null) break;

          routeWeight.setDataValue('product_variant_id', item.product_variant_id);

          weights.push(routeWeight);
        }

        if (weights.length !== data.order_items.length) {
          routes.splice(i--, 1);
        } else {
          routes[i].setDataValue('route_weights', weights);
        }
      }

      for (let [i, route] of routes.entries()) {
        let routeDurations = await RouteDurationRepository.getListByRoute(route.id);
        routes[i].setDataValue('route_durations', routeDurations);
      }
     
      const response = new Response(Response.SUCCESS, req.__('_list_fetched._route'), routes);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException(error));
    }
  }

  async getDiscountSuggestions(req, res, next) {
    
    try {

      const data = req.body;

      const products = [];

      for (let item of data.order_items) {

        let productVariant = await ProductVariantRepository.get(item.product_variant_id);
  
        let index = products.findIndex(product=> product.id === productVariant.product_id);

        if (index === -1) {
          products.push({ id: productVariant.product_id, product_variants: [item] })
        } else {
          products[index].product_variants.push(item);
        }
      }
      
      for (let [i, product] of products.entries()) {

        let quantity = product.product_variants.reduce((prev, variant)=> prev + variant.quantity, 0);

        let amount = product.product_variants.reduce((prev, variant)=> prev + variant.amount, 0);

        let discountProducts = await DiscountProductRepository.getListByNotExpiredAndProductAndQuantityAndAmount(product.id, quantity, amount);

        products[i].discount_products = discountProducts;

      }
     
      const response = new Response(Response.SUCCESS, req.__('_list_fetched._discount'), products);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      console.error(error);
      next(new InternalServerException(error));
    }
  }

}

