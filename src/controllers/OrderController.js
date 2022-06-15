const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const EmailService = require("../emailService");
const Pagination = require("../utils/Pagination");
const ResponseDTO = require("../utils/ResponseDTO");
const StringGenerator = require("../utils/StringGenerator");
const Discount = require("../models/Discount");
const Order = require("../models/Order");
const User = require("../models/User");
const DiscountProductRepository = require("../repository/DiscountProductRepository");
const OrderRepository = require("../repository/OrderRepository");
const ProductVariantRepository = require("../repository/ProductVariantRepository");
const RouteLocationRepository = require("../repository/RouteLocationRepository");
const RouteRepository = require("../repository/RouteRepository");
const RouteWeightRepository = require("../repository/RouteWeightRepository");
const { messageSender } = require("../websocket");

module.exports = class OrderController {

  async create(req, res, next) {
    
    try {

      const data = req.body;
      
      const products = [];

      data.sub_total = 0;

      data.delivery_total = 0;

      data.discount_total = 0;

      data.customer_id = req.auth.customerId;

      data.number = await StringGenerator.orderNumber();

      for (let [i, item] of data.order_items.entries()) {

        let productVariant = await ProductVariantRepository.get(item.product_variant_id);

        data.order_items[i].index = i;

        data.order_items[i].product_id = productVariant.product_id;

        data.order_items[i].weight = Number((productVariant.weight * item.quantity).toFixed(2));

        data.order_items[i].amount = Number((productVariant.price * item.quantity).toFixed(2));

        data.sub_total += Number((productVariant.price * item.quantity).toFixed(2)); 

        if (item.delivery_weight_id !== undefined && item.delivery_weight_id !== null) {
          let routeWeight = await RouteWeightRepository.get(item.delivery_weight_id);
          data.order_items[i].delivery_fee = routeWeight.fee;
          data.delivery_total += routeWeight.fee;
        }
      }
      
      for (const item of data.order_items) {

        const index = products.findIndex(product=> product.id === item.product_id);

        if (index === -1) {
          products.push({ id: item.product_id, product_variants: [item] })
        } else {
          products[index].product_variants.push(item);
        }
      }

      for (const product of products) {

        if (product.product_variants[0].discount_product_id === undefined || 
            product.product_variants[0].discount_product_id === null) 
        {
          continue;
        }

        let discountTotal = 0;

        let discountProduct = await DiscountProductRepository.getWithDiscount(product.product_variants[0].discount_product_id);

        let amountTotal = product.product_variants.reduce((prev, variant)=> prev + variant.amount, 0);

        if (discountProduct.discount.type === Discount.TYPE_AMOUNT) {
          discountTotal = discountProduct.discount.value;
        } else if (discountProduct.discount.type === Discount.TYPE_PERCENTAGE) {
          discountTotal = Number(((discountProduct.discount.value / 100) * amountTotal).toFixed(2));
        }

        data.discount_total += discountTotal;

        for (let variant of product.product_variants) {
          let percentage = (variant.amount * 100) / amountTotal;
          let discountAmount = (percentage / 100) * discountTotal;
          data.order_items[variant.index].discount_amount = Number(discountAmount.toFixed(2));
        }
      }
      
      const result = await OrderRepository.create(data);

      await Promise.all(result.messages.map(chat=> messageSender(req.auth.userId, chat)));
      
      const order = await OrderRepository.get(result.order.id);

      const emails =  [
        EmailService.send(order.customer.user.email, EmailService.ORDER_CREATED, { id: order.id }),
        EmailService.send(order.store.user.email,  EmailService.ORDER_CREATED, { id: order.id, store: true }),
      ];

      if (order.delivery_firm !== null) {
        emails.push(EmailService.send(order.delivery_firm.user.email, EmailService.ORDER_CREATED, { id: order.id, deliveryFirm: true }));
      }

      await Promise.all(emails);
      
      const response = ResponseDTO.success(req.__('_created._order'), order);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getRouteSuggestions(req, res, next) {
    
    try {

      const data = req.body;

      const { customerAddress, storeAddress } = req.data;
      
      const routes = await RouteRepository.getListByLocationCityAndState(
        customerAddress.state, 
        customerAddress.city, 
        storeAddress.state, 
        storeAddress.city
      );

      const within = customerAddress.state === storeAddress.state && customerAddress.city === storeAddress.city;
      
      for (let i=0; i<routes.length; i++) {

        const route = routes[i];

        const locations = await RouteLocationRepository.getListByDeliveryRouteId(route.id);

        if ((within && locations.length > 1) || (!within && locations.length < 2)) {
          routes.splice(i--, 1);
          continue;
        }
        
        let customerFound  = false, storeFound = false;
          
        for (const location of locations) {

          if (location.state === customerAddress.state && location.city === customerAddress.city) {
            customerFound = true;
          }

          if (location.state === storeAddress.state && location.city === storeAddress.city) {
            storeFound = true;
          }

          if (customerFound && storeFound) break;
        }

        if (!customerFound || !storeFound) {
          routes.splice(i--, 1);
          continue;
        }

        const weights = [];

        for (const item of data.order_items) {

          const productVariant = await ProductVariantRepository.get(item.product_variant_id);
  
          const weight = Number((productVariant.weight * item.quantity).toFixed(2));

          const routeWeight = await RouteWeightRepository.getByRouteAndWeight(route.id, weight);

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
     
      const response = ResponseDTO.success(req.__('_list_fetched._route'), routes);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async getDiscountSuggestions(req, res, next) {
    
    try {

      const data = req.body;

      const products = [];

      for (let item of data.order_items) {

        let productVariant = await ProductVariantRepository.get(item.product_variant_id);

        item.amount = Number((productVariant.price * item.quantity).toFixed(2));
  
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
        
        product.product_variants =  product.product_variants.map(v=> {
          v.amount = undefined;
          v.id = v.product_variant_id;
          v.product_variant_id = undefined;
          return v;
        });

        let discountProducts = await DiscountProductRepository.getListByNotExpiredAndProductAndQuantityAndAmount(
          product.id, 
          quantity, 
          amount
        );

        products[i].discount_products = discountProducts;

      }
      
      const response = ResponseDTO.success(req.__('_list_fetched._discount'), products);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async updateStatus(req, res, next) {
    
    try {
      
      if (req.body.status === Order.STATUS_CANCELLED) {

        const result = await OrderRepository.updateStatusToCancel(req.data.order);

        await Promise.all(result.messages.map(chat=> messageSender(req.auth.userId, chat)));
      }

      const order = await OrderRepository.get(req.data.order.id);

      if (req.body.status === Order.STATUS_CANCELLED) {
        const emails =  [EmailService.send(order.store.user.email, EmailService.ORDER_CANCELLED, { id: order.id })];

        if (order.delivery_firm !== null) {
          emails.push(EmailService.send(order.delivery_firm.user.email, EmailService.ORDER_CANCELLED, { id: order.id }));
        }

        await Promise.all(emails);
      }

      const response = ResponseDTO.success(req.__('_updated._order'), order);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async storeStatusUpdate(req, res, next) {
    
    try {

      let result, emailType;
      
      switch (req.body.store_status) {
        case Order.STORE_STATUS_ACCEPTED:
          emailType = EmailService.ORDER_ACCEPTED;
          result = await OrderRepository.updateStoreStatusToAccepted(req.data.order);
          break;
        case Order.STORE_STATUS_DECLINED:
          emailType = EmailService.ORDER_DECLINED;
          result = await OrderRepository.updateStoreStatusToDeclined(req.data.order);
          break;
      }

      if (result !== undefined) 
        await messageSender(req.auth.userId, result.message);
      
      const order = await OrderRepository.get(req.data.order.id);

      if (emailType !== undefined)
        await EmailService.send(order.customer.user.email, emailType, { id: order.id, userType: User.TYPE_STORE });
      
      const response = ResponseDTO.success(req.__('_updated._order'), order);

      res.status(StatusCodes.OK).send(response);
      
    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  async deliveryFirmStatusUpdate(req, res, next) {
    
    try {
      
      let result, emailType;

      switch (req.body.delivery_firm_status) {
        case Order.DELIVERY_FIRM_STATUS_ACCEPTED:
          emailType = EmailService.ORDER_ACCEPTED;
          result = await OrderRepository.updateDeliveryFirmStatusToAccepted(req.data.order);
          break;
        case Order.DELIVERY_FIRM_STATUS_DECLINED:
          emailType = EmailService.ORDER_DECLINED;
          result = await OrderRepository.updateDeliveryFirmStatusToDeclined(req.data.order);
          break;
      }

      if (result !== undefined)
        await messageSender(req.auth.userId, result.message);

      const order = await OrderRepository.get(req.data.order.id);
      
      if (emailType !== undefined)
        await EmailService.send(order.customer.user.email, emailType, { id: order.id, userType: User.TYPE_DELIVERY_FIRM });

      const response = ResponseDTO.success(req.__('_updated._order'), order);

      res.status(StatusCodes.OK).send(response);
      
    } catch (error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  get(req, res) {

    const response = ResponseDTO.success(req.__('_fetched._order'), req.data.order);

    res.status(StatusCodes.OK).send(response);
  }

  async getList(req, res, next) {

    try {

      const { pager, orderFilter } = req.data;

      const { count, rows } = await OrderRepository.getList(pager.page_offset, pager.page_limit, orderFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._order'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  getListByCustomer = async (req, res, next)=> {
    
    try {

      const { pager, customer, orderFilter } = req.data;

      const { count, rows } = await OrderRepository.getListByCustomer(customer, pager.page_offset, pager.page_limit, orderFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._order'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

  getListByStore = async (req, res, next)=> {
    
    try {

      const { pager, store, orderFilter } = req.data;

      const { count, rows } = await OrderRepository.getListByStore(store, pager.page_offset, pager.page_limit, orderFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._order'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }
  
  getListByDeliveryFirm = async (req, res, next)=> {
    
    try {

      const { pager, deliveryFirm, orderFilter } = req.data;

      const { count, rows } = await OrderRepository.getListByDeliveryFirm(deliveryFirm, pager.page_offset, pager.page_limit, orderFilter);

      const pagination = new Pagination(req, pager.page, pager.page_limit, count);

      const response = ResponseDTO.success(req.__('_list_fetched._order'), rows, pagination);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(createHttpError.InternalServerError(error));
    }
  }

}
