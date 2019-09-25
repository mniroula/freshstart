const parseStrDate = (d, m, y) => {
  let nMonth = null;
  switch (m) {
    case 'Jan': 
      nMonth = '01';
      break;
    case 'Feb': 
      nMonth = '02';
      break;
    case 'Mar': 
      nMonth = '03';
      break;
    case 'Apr': 
      nMonth = '04';
      break;
    case 'May': 
      nMonth = '05';
      break;
    case 'Jun': 
      nMonth = '06';
      break;
    case 'Jul': 
      nMonth = '07';
      break;
    case 'Aug': 
      nMonth = '08';
      break;
    case 'Sep': 
      nMonth = '09';
      break;
    case 'Oct': 
      nMonth = '10';
      break;
    case 'Nov': 
      nMonth = '11';
      break;
    case 'Dec': 
      nMonth = '12';
      break;
  }
  return `${y}-${nMonth}-${d}`;
};

const parseSessionDate = (strDate) => {
  const sessionPattern1 = /(\w{3})\s(\d{1,2})-(\w{3})\s(\d{1,2})\s(\d{4})/;
  const sessionPattern2 = /(\w{3})\s(\d{1,2})-(\d{1,2})\s(\d{4})/;
  if (sessionPattern1.test(strDate)) {
    // Oct 28-Nov 18 2018
    const match = strDate.match(sessionPattern1);
    return {
      name: `${match[1]} ${match[2]}-${match[3]} ${match[4]}, ${match[5]}`,
      start_date: parseStrDate(match[2], match[1], match[5]),
      end_date: parseStrDate(match[4], match[3], match[5]),
    };
  } else {
    // Jan 6-27 2019
    const match = strDate.match(sessionPattern2);
    return {
      name: `${match[1]} ${match[2]}-${match[3]}, ${match[4]}`,
      start_date: parseStrDate(match[2], match[1], match[4]),
      end_date: parseStrDate(match[3], match[1], match[4]),
    };
  }
};

 module.exports = {
  parseSessionDate,
 };