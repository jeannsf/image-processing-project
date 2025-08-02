const API_URL = process.env.REACT_APP_API_URL;


export interface Background {
  id: string;
  name: string;
  url: string;
}


export async function fetchBackgrounds(): Promise<Background[]> {
  const response = await fetch(`${API_URL}/images/backgrounds/list`);
  if (!response.ok) {
    throw new Error('Failed to fetch backgrounds');
  }

  const data = await response.json();

  return data.backgrounds.map((bg: Background) => ({
    ...bg,
    url: `${API_URL}${bg.url}`,
  }));
}

