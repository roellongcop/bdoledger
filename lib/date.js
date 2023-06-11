const getCurrentDate = (options = { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: "Asia/Manila" }, currentDate = new Date()) => {
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return String(formattedDate);
};

const convertDateFormat = (dateString) => {
  var dateParts = dateString.split('/');
  var day = dateParts[1];
  var month = dateParts[0];
  var year = dateParts[2];
  
  return `${year}-${month}-${day}`;
}

const convertToDate = (dateString) => {
  var dateParts = dateString.split('/');
  var month = parseInt(dateParts[0]) - 1;
  var day = parseInt(dateParts[1]);
  var year = parseInt(dateParts[2]);

  var convertedDate = new Date(year, month, day);
  return convertedDate;
}


const timeAgo = (time) => {
  const currentDate = new Date();

  const timeDifference = currentDate.getTime() - time;

  const seconds = parseInt(Math.floor(timeDifference / 1000));

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 5) {
    return 'Just now';
  } else if (seconds < 60) {
    return seconds + ' seconds ago';
  } else if (minutes < 60) {
    return minutes + ' minutes ago';
  } else if (hours < 24) {
    return hours + ' hours ago';
  } else if (days < 30) {
    return days + ' days ago';
  } else if (months < 12) {
    return months + ' months ago';
  } else {
    return years + ' years ago';
  }
}


export { getCurrentDate, convertDateFormat, convertToDate, timeAgo };
