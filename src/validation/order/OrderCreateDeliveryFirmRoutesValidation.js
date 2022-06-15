const { validationResult, body } = require("express-validator");
const createHttpError = require("http-errors");
const Order = require("../../models/Order");
const AddressRepository = require("../../repository/AddressRepository");
const DeliveryFirmRepository = require("../../repository/DeliveryFirmRepository");
const ProductVariantRepository = require("../../repository/ProductVariantRepository");
const RouteRepository = require("../../repository/RouteRepository");
const StoreRepository = require("../../repository/StoreRepository");

module.exports = async function(req, res, next) {

  if (!validationResult(req).isEmpty()) {
    return next();
  }

  const err = [];

  const data = req.body;

  let route, customerAddress;

  let deliveryFirmErr, routeErr, customerAddressErr;

  const requiredMessage =  req.__('_error._form._field_required');

  const notRequiredMessage =  req.__('_error._form._field_not_required');

  const invalidIDMessage = req.__('_error._form._id_invalid');

  try {

    if (data.delivery_method === Order.DELIVERY_METHOD_DOOR) {

      if (data.delivery_firm_id === undefined || data.delivery_firm_id === null) {
        deliveryFirmErr = requiredMessage;
      } else if (! (await DeliveryFirmRepository.statusIsActive(data.delivery_firm_id))) {
        deliveryFirmErr = invalidIDMessage;
      }

      if (data.delivery_route_id === undefined || data.delivery_route_id === null) {
        routeErr = requiredMessage;
      } else {
        route = await RouteRepository.get(req.body.delivery_route_id);
        if (route === null || route.delivery_firm_id !== data.delivery_firm_id) {
          routeErr = invalidIDMessage;
        }
      }

      if (data.customer_address_id === undefined || data.customer_address_id === null) {
        customerAddressErr = requiredMessage;
      } else {
        customerAddress = await AddressRepository.get(data.customer_address_id);
        if (customerAddress === null) {
          customerAddressErr = invalidIDMessage;
        }
      }

      for (let [i, item] of data.order_items.entries()) {

        if (item.delivery_weight_id === undefined || item.delivery_weight_id === null) {
          err.push({ name: 'delivery_weight_id', message: requiredMessage, index: i });
        } else if (route === null || route === undefined || route.delivery_route_weights.find(w=> w.id === item.delivery_weight_id) === undefined) {
          err.push({ name: 'delivery_weight_id', message: invalidIDMessage, index: i });
        }
      }

      
      if (deliveryFirmErr === undefined && routeErr === undefined && customerAddressErr === undefined && err.length === 0) {
        
        const storeAddress = (await StoreRepository.get(data.store_id)).user.addresses[0];

        const within = customerAddress.state === storeAddress.state && customerAddress.city === storeAddress.city;
        
        if (
          (within && route.delivery_route_locations.length === 1) || 
          (!within && route.delivery_route_locations.length > 1)
        ) {

          let customerFound  = false, storeFound = false;
          
          for(const location of route.delivery_route_locations) {

            if (location.state === customerAddress.state && location.city === customerAddress.city) {
              customerFound = true;
            }

            if (location.state === storeAddress.state && location.city === storeAddress.city) {
              storeFound = true;
            }

            if (customerFound && storeFound) break;
          }
          
          if (customerFound && storeFound) {

            for (let [i, item] of data.order_items.entries()) {

              let routeWeight = route.delivery_route_weights.find(w=> w.id === item.delivery_weight_id);
              
              let productVariant = await ProductVariantRepository.get(item.product_variant_id);
  
              let weight = productVariant.weight * item.quantity;
  
              if (routeWeight.minimium > weight || routeWeight.maximium < weight) {
                err.push({ name: 'delivery_weight_id', message: invalidIDMessage, index: i });
              }
            }

          } else {
            routeErr = invalidIDMessage;
          }

        } else {
          routeErr = invalidIDMessage;
        }
      }

    } else {

      // Delivery data should not be sent if delivery method is not DOOR.

      if (data.delivery_firm_id !== undefined && data.delivery_firm_id !== null) {
        deliveryFirmErr = notRequiredMessage;
      }

      if (data.customer_address_id !== undefined && data.customer_address_id !== null) {
        customerAddressErr = notRequiredMessage;
      }

      if (data.delivery_route_id !== undefined && data.delivery_route_id !== null) {
        routeErr = notRequiredMessage;
      }

      for (let [i, item] of req.body.order_items.entries()) {

        if (item.delivery_weight_id !== undefined && item.delivery_weight_id !== null) {
          err.push({ name: 'delivery_weight_id', message: notRequiredMessage, index: i });
        }
      }
    }

    if (deliveryFirmErr !== undefined) {
      await body('delivery_firm_id').custom(()=> { throw deliveryFirmErr; }).run(req);
    }

    if (customerAddressErr !== undefined) {
      await body('customer_address_id').custom(()=> { throw customerAddressErr; }).run(req);
    }

    if (routeErr !== undefined) {
      await body('delivery_route_id').custom(()=> { throw routeErr; }).run(req);
    }

    if (err.length > 0) {
      await body('order_items').custom(()=> { throw err; }).run(req);
    }

    next();

  } catch (error) {
    console.error(error);
    next(createHttpError.InternalServerError(error));
  }
}
