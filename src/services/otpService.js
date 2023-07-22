export const createOTP = (model, payload) =>
  model.create({
      ...payload
});

export const findOtp = (model, filter) => model.findOne(
{
    where:filter, 
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    raw: true
});

export const updateOtp = (model, payload, id) =>
  model.update(
    {...payload},
    {where: { id: id}}
);