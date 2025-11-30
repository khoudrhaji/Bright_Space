const Coupon = require('../models/Coupon');

const calculatePrice = async (service, options, couponCode) => {
    let totalPrice = service.basePrice;

    // Add costs for extra options
    if (options) {
        if (options.windows) {
            totalPrice += 20;
        }
        if (options.deepKitchen) {
            totalPrice += 30;
        }
    }

    // Apply coupon discount
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
        if (coupon) {
            if (coupon.isPercent) {
                totalPrice = totalPrice - (totalPrice * coupon.discount / 100);
            } else {
                totalPrice = totalPrice - coupon.discount;
            }
        }
    }

    return totalPrice;
};

module.exports = calculatePrice;
