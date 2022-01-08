const { validationResult, body } = require("express-validator");
const InternalServerException = require("../../http/exceptions/InternalServerException");
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

  const invalidMessage =  req.__('_error._form._field_invalid');

  const invalidIDMessage = req.__('_error._form._id_invalid');

  const differenceMessage = req.__('_error._form._field_not_duplicated');

  try {

    if (data.delivery_method === Order.DELIVERY_METHOD_DOOR) {

      if (data.delivery_firm_id === undefined || data.delivery_firm_id === null) {
        deliveryFirmErr = requiredMessage;
      } else if (! (await DeliveryFirmRepository.idExists(data.delivery_firm_id))) {
        deliveryFirmErr = invalidIDMessage;
      }

      if (data.route_id === undefined || data.route_id === null) {
        routeErr = requiredMessage;
      } else {
        route = await RouteRepository.get(req.body.route_id);
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

        if (item.route_weight_id === undefined || item.route_weight_id === null) {
          err.push({ name: 'route_weight_id', message: requiredMessage, index: i });
        } else if (route === null || route === undefined || route.route_weights.find(w=> w.id === item.route_weight_id) === undefined) {
          err.push({ name: 'route_weight_id', message: invalidIDMessage, index: i });
        }
        
        if (item.route_duration_id === undefined || item.route_duration_id === null) {
          err.push({ name: 'route_duration_id', message: requiredMessage, index: i });
        } else if (route === null || route === undefined || route.route_durations.find(d=> d.id === item.route_duration_id) === undefined) {
          err.push({ name: 'route_duration_id', message: invalidIDMessage, index: i });
        }
      }

      
      if (deliveryFirmErr === undefined && routeErr === undefined && customerAddressErr === undefined && err.length === 0) {
        
        const storeAddress = (await StoreRepository.get(data.store_id)).user.addresses[0];

        if (
          (route.location_1_state === customerAddress.state &&
            route.location_2_state === storeAddress.state &&
            (
              (route.location_1_city === customerAddress.city &&
              route.location_2_city === storeAddress.city) ||
              (
                route.location_1_city === null &&
                route.location_2_city === null
              )
            )
          )
          ||
          (route.location_1_state === storeAddress.state &&
            route.location_2_state === customerAddress.state &&
            (
              (route.location_1_city === storeAddress.city &&
              route.location_2_city === customerAddress.city) ||
              (
                route.location_1_city === null &&
                route.location_2_city === null
              )
            )
          )
        ) {

          for (let [i, item] of data.order_items.entries()) {

            let routeWeight = route.route_weights.find(w=> w.id === item.route_weight_id);

            let productVariant = await ProductVariantRepository.get(item.product_variant_id);

            let weight = productVariant.weight * item.quantity;

            if (routeWeight.minimium > weight || routeWeight.maximium < weight) {
              err.push({ name: 'route_weight_id', message: invalidIDMessage, index: i });
            }
            
          }

          if (err.length === 0) {

            const errIndex = [];

            for (let i = 0; i <  data.order_items.length; i++) {
              for (let j = i; j <  data.order_items.length-1; j++) {
                let v1 = data.order_items[i];
                let v2 = data.order_items[j+1];
                if (v1.route_duration_id !== v2.route_duration_id) {
                  
                  if (!errIndex.includes(i)) {
                    errIndex.push(i);
                    err.push({ name: 'route_duration_id', message: differenceMessage, index: i });
                  }
          
                  if (!errIndex.includes(j+1)) {
                    errIndex.push(j+1);
                    err.push({ name: 'route_duration_id', message: differenceMessage, index: j+1 });
                  }
                }
              }
            }

          }

        } else {
          routeErr = invalidIDMessage;
        }
      }

    } else {

      if (data.delivery_firm_id !== undefined && data.delivery_firm_id !== null) {
        deliveryFirmErr = notRequiredMessage;
      }

      if (data.customer_address_id !== undefined && data.customer_address_id !== null) {
        customerAddressErr = notRequiredMessage;
      }

      if (data.route_id !== undefined && data.route_id !== null) {
        routeErr = notRequiredMessage;
      }

      for (let [i, item] of req.body.order_items.entries()) {

        if (item.route_weight_id !== undefined && item.route_weight_id !== null) {
          err.push({ name: 'route_weight_id', message: notRequiredMessage, index: i });
        }

        if (item.route_duration_id !== undefined && item.route_duration_id !== null) {
          err.push({ name: 'route_duration_id', message: notRequiredMessage, index: i });
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
      await body('route_id').custom(()=> { throw routeErr; }).run(req);
    }

    if (err.length > 0) {
      await body('order_items').custom(()=> { throw err; }).run(req);
    }

    next();

  } catch (error) {
    next(new InternalServerException(error));
  }
}
