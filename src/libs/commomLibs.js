export const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
export const getPaginationData = (datas , page, limit) => {
    const { count: total, rows: data } = datas;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(total / limit);
  return { total, data, totalPages, currentPage };
};
export const orderNumberGenerator = () => {
  var result           = '';
  var length           = 8;
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  result = result.slice(0, 4) + "-" + result.slice(4);
  return result;
};
export const branchIdGenerator = () => {
  var result           = '';
  var length           = 6;
  var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
  
  return result;
};

