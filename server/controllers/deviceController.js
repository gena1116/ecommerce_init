const path = require('path');
const { uuid } = require('uuidv4');
const ApiError = require('../error/ApiError');
const { Device } = require('../models/models');

class DeviceController {
    async create(req, res, next) {
        try {
            const { device_name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;
            let fileName = uuid() + '.jpg';

            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({
                device_name,
                price,
                brandId,
                typeId,
                img: fileName,
            });
            return res.json(device);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        let { typeId, brandId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        console.log(limit);
        console.log(offset);

        let devices;

        if (!typeId && !brandId) {
            devices = await Device.findAll({ limit, offset });
        } else if (typeId && !brandId) {
            devices = await Device.findAll({
                where: { typeId },
                limit,
                offset,
            });
        } else if (!typeId && brandId) {
            devices = await Device.findAll({
                where: { brandId },
                limit,
                offset,
            });
        } else if (typeId && brandId) {
            devices = await Device.findAll({
                where: { typeId, brandId },
                limit,
                offset,
            });
        }

        return res.json(devices);
    }

    async getOne(req, res) {}
}

module.exports = new DeviceController();
