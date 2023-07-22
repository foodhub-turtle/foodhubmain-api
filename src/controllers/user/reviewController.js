import _ from "lodash";
import Model from "../../models/index.js";
import catchAsync from "../../libs/catchAsync.js";
const reviewService = require("../../services/reviewService.js");
const { order, review } = Model;

export const setReviewByCustomer = catchAsync(async (req, res, next) => {
    let payload = {
        branch_id: req.body.branch_id,
        customer_id: req.body.customer_id,
        order_id: req.body.order_id,
        rider_id: req.body.rider_id,
        rating: req.body.rating,
        rider_rating: req.body.rider_rating,
        review: req.body.review,
        is_view_approve: 1,
        liked_options: req.body.liked_options,
        status: 1
    };

    let result = await reviewService.createReview(review, payload);

    return res.status(200).json({
      status: "success", 
      statusCode: 200,
      message: 'Review created successfully'
    });
  });
