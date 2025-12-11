/*
 * Simple Unsplash API helpers.
 * Uses `REACT_APP_UNSPLASH_ACCESS_KEY` environment variable when available.
 * Returns a single curated photo (first result) for a given query.
 */

const BASE = 'https://api.unsplash.com';

// Debug: log env var on module load
console.log('📦 Unsplash service loaded');
console.log('🔑 API Key env check:', process.env.REACT_APP_UNSPLASH_ACCESS_KEY ? 'PRESENT ✅' : 'MISSING ⚠️');

export async function searchPhoto(query: string) {
  const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn('❌ No Unsplash API key in searchPhoto');
    throw new Error('MISSING_UNSPLASH_KEY');
  }

  console.log('🔄 Fetching Unsplash photo for:', query);

  const params = new URLSearchParams({
    query,
    per_page: '1',
    orientation: 'landscape',
  });

  const url = `${BASE}/search/photos?${params.toString()}`;
  console.log('📍 Unsplash URL:', url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${key}`,
      },
    });

    console.log('📨 Unsplash response status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Unsplash API error:', res.status, text);
      throw new Error(`Unsplash API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    console.log('📦 Unsplash data received:', data);

    if (!data || !data.results || data.results.length === 0) {
      console.warn('⚠️ No results from Unsplash');
      throw new Error('NO_UNSPLASH_RESULTS');
    }

    const p = data.results[0];
    const result = {
      url: p.urls.full || p.urls.regular,
      photographer: p.user?.name || p.user?.username || 'Unsplash',
      photographer_page: p.user?.links?.html || null,
      unsplash_page: p.links?.html || null,
    };
    console.log('✅ Unsplash photo found:', result.url.substring(0, 50) + '...');
    return result;
  } catch (error) {
    console.error('❌ Unsplash fetch error:', error);
    throw error;
  }
}

/**
 * Search for a recipe image from Unsplash
 * Used to fetch images for recipe cards (smaller, square-ish orientation)
 */
export async function searchRecipeImage(recipeName: string) {
  const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn('❌ No Unsplash API key in searchRecipeImage');
    throw new Error('MISSING_UNSPLASH_KEY');
  }

  console.log('🍳 Fetching recipe image for:', recipeName);

  const params = new URLSearchParams({
    query: `${recipeName} food`,
    per_page: '1',
    orientation: 'squarish',
  });

  const url = `${BASE}/search/photos?${params.toString()}`;
  console.log('📍 Recipe image URL:', url);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${key}`,
      },
    });

    console.log('📨 Recipe image response status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Recipe image API error:', res.status, text);
      throw new Error(`Unsplash API error: ${res.status} ${text}`);
    }

    const data = await res.json();
    if (!data || !data.results || data.results.length === 0) {
      console.warn('⚠️ No recipe image results');
      throw new Error('NO_UNSPLASH_RESULTS');
    }

    const p = data.results[0];
    const result = {
      url: p.urls.regular || p.urls.small,
      photographer: p.user?.name || p.user?.username || 'Unsplash',
      unsplash_page: p.links?.html || null,
    };
    console.log('✅ Recipe image found for:', recipeName);
    return result;
  } catch (error) {
    console.error('❌ Recipe image fetch error:', error);
    throw error;
  }
}
