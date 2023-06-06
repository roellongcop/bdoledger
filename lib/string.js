const truncateText = (text, maxLength = 50) => {

  if (!text) {
    return;
  }
  if (text.length <= maxLength) {
    return text; // No need to truncate
  }

  const truncatedText = text.substring(0, maxLength - 3) + '...';
  return truncatedText.trim();
}


export {
  truncateText
}