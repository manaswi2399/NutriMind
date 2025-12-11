import React, { useMemo, useEffect, useState } from 'react';
import './Background.css';
import { searchPhoto } from '../services/unsplash';

type Variant = 'home' | 'diet' | 'ingredients' | 'favorites';

const queryMap: Record<Variant, string[]> = {
  home: ['healthy food', 'wellness', 'balanced diet'],
  diet: ['salad', 'meal prep', 'healthy meal'],
  ingredients: ['fresh produce', 'ingredients', 'herbs'],
  favorites: ['gourmet', 'comfort food', 'colorful food'],
};

const Background: React.FC<{ variant?: Variant }> = ({ variant = 'home' }) => {
  // Debug: Log environment variable availability
  useEffect(() => {
    const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
    console.log('🔍 Background Component Mounted');
    console.log('🔑 Unsplash API Key present:', !!key);
    if (key) {
      console.log('✅ Key starts with:', key.substring(0, 10) + '...');
    } else {
      console.warn('⚠️ REACT_APP_UNSPLASH_ACCESS_KEY is NOT set - will use fallback');
    }
  }, []);

  // Default fallback Source URL (used if no API key or API fails)
  const fallbackUrl = useMemo(() => {
    const queries = queryMap[variant] || queryMap.home;
    const q = queries.join(',');
    const sig = Math.floor(Math.random() * 10000);
    return `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)}&sig=${sig}`;
  }, [variant]);

  const [photoUrl, setPhotoUrl] = useState<string>(fallbackUrl);
  const [credit, setCredit] = useState<{ name: string; url?: string | null } | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Try Unsplash API when key is available. Fall back to source.unsplash when missing/error.
  useEffect(() => {
    console.log('🎨 Background useEffect triggered, variant:', variant);
    
    let cancelled = false;
    setLoaded(false);
    setCredit(null);

    const doFallback = () => {
      console.log('📍 Using fallback URL');
      setPhotoUrl(fallbackUrl);
      // Show fallback immediately (it's usually fast)
      const img = new Image();
      img.src = fallbackUrl;
      img.onload = () => {
        console.log('✅ Fallback image loaded');
        !cancelled && setLoaded(true);
      };
      img.onerror = () => {
        // Even if image fails, show the background color
        console.warn('⚠️ Fallback image failed, showing background');
        !cancelled && setLoaded(true);
      };
    };

    const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
    console.log('🔑 Key check in Background:', !!key);
    
    if (!key) {
      console.log('ℹ️ No Unsplash API key found, using fallback source.unsplash');
      doFallback();
      return () => {
        cancelled = true;
      };
    }

    console.log('🚀 Starting Unsplash API call...');
    (async () => {
      try {
        const q = (queryMap[variant] && queryMap[variant][0]) || queryMap.home[0];
        console.log('📸 Fetching Unsplash image for:', q);
        const res = await searchPhoto(q);
        console.log('📦 Got response from searchPhoto');
        
        if (cancelled) {
          console.log('cancelled, returning');
          return;
        }
        
        console.log('🖼️ Setting photo URL:', res.url.substring(0, 50) + '...');
        setPhotoUrl(res.url);
        setCredit({ name: res.photographer, url: res.photographer_page || res.unsplash_page });

        const img = new Image();
        img.src = res.url;
        let loadedFlag = false;
        img.onload = () => {
          console.log('✅ Unsplash image loaded:', q);
          if (!cancelled && !loadedFlag) {
            loadedFlag = true;
            setLoaded(true);
          }
        };
        img.onerror = () => {
          console.warn('❌ Failed to load Unsplash image, falling back');
          !cancelled && doFallback();
        };
        
        // Timeout: if image doesn't load in 3 seconds, show it anyway
        setTimeout(() => {
          if (!cancelled && !loadedFlag) {
            console.log('⏰ Image load timeout, showing anyway');
            loadedFlag = true;
            setLoaded(true);
          }
        }, 3000);
      } catch (err) {
        console.error('💥 Unsplash API error:', err, 'using fallback');
        if (cancelled) return;
        doFallback();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [variant, fallbackUrl]);

  return (
    <div className={`background bg-variant-${variant}`} aria-hidden>
      <div className={`photo ${loaded ? 'visible' : ''}`} style={{ backgroundImage: `url('${photoUrl}')` }} />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      <div className="sparkle s1" />
      <div className="sparkle s2" />
      {credit && (
        <div className="photo-credit">
          Photo: <a href={credit.url || '#'} target="_blank" rel="noopener noreferrer">{credit.name}</a> / Unsplash
        </div>
      )}
    </div>
  );
};

export default Background;
