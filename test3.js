try {
    const theme = localStorage.getItem('BhuSetu_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
