const { StatusCodes } = require("http-status-codes");
const InternalServerException = require("../http/exceptions/InternalServerException");
const Response = require("../http/Response");
const AddressRepository = require("../repository/AddressRepository");
const DeliveryFirmRepository = require("../repository/DeliveryFirmRepository");
const StoreRepository = require("../repository/StoreRepository");

module.exports = class AddressController {

  async add(req, res, next) {
    
    try {

      const _address = await AddressRepository.addForCustomer(req.body, req.auth.userId);

      const address = await AddressRepository.get(_address.id);

      const response = new Response(Response.SUCCESS, req.__('_created._address'), address);

      res.status(StatusCodes.CREATED).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateStoreAddress(req, res, next) {
    
    try {

      const { store: { user } } = req.data;
      
      await AddressRepository.addOrUpdate(user, req.body);

      const store = await StoreRepository.get(req.data.store.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._address'), store);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async updateDeliveryFirmAddress(req, res, next) {

    try {

      const { deliveryFirm: { user } } = req.data;
      
      await AddressRepository.addOrUpdate(user, req.body);

      const deliveryFirm = await DeliveryFirmRepository.get(req.data.deliveryFirm.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._address'), deliveryFirm);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async update(req, res, next) {
    
    try {

      const _address = req.data.address;

      await AddressRepository.updateForCustomer(_address, req.body);

      const address = await AddressRepository.get(_address.id);

      const response = new Response(Response.SUCCESS, req.__('_updated._address'), address);

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  async delete(req, res, next) {
    
    try {

      await AddressRepository.deleteForCustomer(req.data.address);

      const response = new Response(Response.SUCCESS, req.__('_deleted._address'));

      res.status(StatusCodes.OK).send(response);

    } catch (error) {
      next(new InternalServerException(error));
    }
  }

  get(req, res) {

    const response = new Response(Response.SUCCESS, req.__('_fetched._address'), req.data.address);

    res.status(StatusCodes.OK).send(response);
  }

  async getListByCustomer(req, res, next) {

    try {

      const addresses = await AddressRepository.getListByCustomer(req.data.customer.user.id);

      const response = new Response(Response.SUCCESS, req.__('_list_fetched._address'), addresses);

      res.status(StatusCodes.OK).send(response);

    } catch(error) {
      next(new InternalServerException());
    }
  }



}

