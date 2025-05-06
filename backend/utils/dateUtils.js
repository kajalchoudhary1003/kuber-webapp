const getFiscalYear = (date) => {
    const givenDate = new Date(date);
    const year = givenDate.getFullYear();
    const month = givenDate.getMonth();
  
    return month >= 3 ? year : year - 1;
  };
  
  module.exports = {
    getFiscalYear,
  };
  