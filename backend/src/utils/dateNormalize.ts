export const formatDate = (dateString: string, locale: string = 'id-ID') => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; 
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };
  