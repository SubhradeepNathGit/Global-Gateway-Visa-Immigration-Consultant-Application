import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllCountryDetails } from '../../../Redux/Slice/countrySlice';
import { encodeBase64Url } from '../../../util/encodeDecode/base64';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

// Curated high-resolution destination photos for common countries
const COUNTRY_PHOTOS = {
  'south africa': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1000&auto=format&fit=crop', // Cape Town
  'mexico': 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1000&auto=format&fit=crop', // Mexico Chichen Itza / Tulum
  'thailand': 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1000&auto=format&fit=crop', // Thailand Wat Arun / Bangkok
  'turkey': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop', // Istanbul
  'greece': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop', // Santorini Greece
  'australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop', // Sydney
  'united states': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1000&auto=format&fit=crop', // NYC
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop', // Dubai
  'canada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop', // Banff Lake Louise
  'india': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop', // Taj Mahal
  'germany': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop', // Neuschwanstein
  'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop', // Eiffel Tower
  'united kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop', // London
  'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop', // Kyoto/Fuji
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000&auto=format&fit=crop', // Marina Bay
  'italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1000&auto=format&fit=crop', // Venice
  'spain': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop', // Spain
};

const COUNTRY_FLAGS = {
  'south africa': 'https://flagcdn.com/w80/za.png',
  'mexico': 'https://flagcdn.com/w80/mx.png',
  'thailand': 'https://flagcdn.com/w80/th.png',
  'turkey': 'https://flagcdn.com/w80/tr.png',
  'greece': 'https://flagcdn.com/w80/gr.png',
  'australia': 'https://flagcdn.com/w80/au.png',
  'united states': 'https://flagcdn.com/w80/us.png',
  'dubai': 'https://flagcdn.com/w80/ae.png',
  'canada': 'https://flagcdn.com/w80/ca.png',
  'india': 'https://flagcdn.com/w80/in.png',
  'germany': 'https://flagcdn.com/w80/de.png',
  'france': 'https://flagcdn.com/w80/fr.png',
  'united kingdom': 'https://flagcdn.com/w80/gb.png',
  'italy': 'https://flagcdn.com/w80/it.png',
  'spain': 'https://flagcdn.com/w80/es.png',
};

// Fallback list of 10 countries if database is empty or loading
const DEFAULT_TEN_COUNTRIES = [
  { name: 'South Africa', continent: 'Africa', flag: 'https://flagcdn.com/w80/za.png' },
  { name: 'Mexico', continent: 'North America', flag: 'https://flagcdn.com/w80/mx.png' },
  { name: 'Thailand', continent: 'Asia', flag: 'https://flagcdn.com/w80/th.png' },
  { name: 'Turkey', continent: 'Europe / Asia', flag: 'https://flagcdn.com/w80/tr.png' },
  { name: 'Greece', continent: 'Europe', flag: 'https://flagcdn.com/w80/gr.png' },
  { name: 'Australia', continent: 'Oceania', flag: 'https://flagcdn.com/w80/au.png' },
  { name: 'Canada', continent: 'North America', flag: 'https://flagcdn.com/w80/ca.png' },
  { name: 'Germany', continent: 'Europe', flag: 'https://flagcdn.com/w80/de.png' },
  { name: 'France', continent: 'Europe', flag: 'https://flagcdn.com/w80/fr.png' },
  { name: 'United Kingdom', continent: 'Europe', flag: 'https://flagcdn.com/w80/gb.png' },
];

const CountrySupportSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { getAllCountryList } = useSelector((state) => state.allCountry);

  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerHeight, setContainerHeight] = useState(2500);

  // Buffer distances to make entry point and exit point accurate and pleasant
  const ENTRY_BUFFER = 40; // Pin locks section first before cards start translating
  const EXIT_BUFFER = 30; // Last card sits fully in view before unpinning to vertical scroll

  // Fetch countries if not yet loaded in Redux
  useEffect(() => {
    if (!getAllCountryList || getAllCountryList.length === 0) {
      dispatch(fetchAllCountryDetails()).catch((err) => {
        console.error('Error fetching countries:', err);
      });
    }
  }, [dispatch, getAllCountryList]);

  // Clean 10 countries dataset (from DB first, then fallback)
  const tenCountries = useMemo(() => {
    const rawList = Array.isArray(getAllCountryList) ? getAllCountryList : [];
    const activeFromDb = rawList.filter((c) => !c.is_blocked && (!c.is_approved || c.is_approved !== 'rejected'));

    const list = [];

    // Prioritize active database items
    for (let i = 0; i < Math.min(10, activeFromDb.length); i++) {
      const cun = activeFromDb[i];
      const lowerName = (cun.name || '').toLowerCase();

      // Continents string
      const continentsData = cun.country_details?.continents || cun.continents;
      let continentStr = 'Global';
      if (Array.isArray(continentsData) && continentsData.length > 0) {
        continentStr = continentsData[0];
      } else if (typeof continentsData === 'string' && continentsData) {
        continentStr = continentsData.replace(/[\[\]\" ]/g, '').split(',')[0] || continentsData;
      }

      // Check if image is custom or generic demo
      let img = cun.image_url || cun.country_details?.banner_url || cun.image?.url;
      if (!img || img.includes('photo-1469854523086-cc02fe5d8800')) {
        img = COUNTRY_PHOTOS[lowerName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop';
      }

      const flag = cun.country_details?.flag_url || cun.flag || COUNTRY_FLAGS[lowerName] || 'https://flagcdn.com/w80/un.png';

      list.push({
        id: cun.id,
        name: cun.name,
        flag: flag,
        image: img,
        continent: continentStr,
      });
    }

    // Fill with curated defaults if fewer than 10 in DB
    let fallbackIdx = 0;
    while (list.length < 10 && fallbackIdx < DEFAULT_TEN_COUNTRIES.length) {
      const def = DEFAULT_TEN_COUNTRIES[fallbackIdx];
      const exists = list.some((item) => item.name.toLowerCase() === def.name.toLowerCase());
      if (!exists) {
        const lowerName = def.name.toLowerCase();
        list.push({
          id: null,
          name: def.name,
          flag: def.flag || COUNTRY_FLAGS[lowerName],
          image: COUNTRY_PHOTOS[lowerName] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop',
          continent: def.continent,
        });
      }
      fallbackIdx++;
    }

    return list.slice(0, 10);
  }, [getAllCountryList]);

  // Accurate container height calculation:
  // Uses track's parent clientWidth to guarantee the 11th item (View More) sits fully inside the screen
  useEffect(() => {
    const updateDimensions = () => {
      if (!trackRef.current || !trackRef.current.parentElement) return;
      const trackWidth = trackRef.current.scrollWidth;
      const clientWidth = trackRef.current.parentElement.clientWidth;
      const maxHorizontalScroll = Math.max(0, trackWidth - clientWidth + 30);
      const totalScrollSpan = maxHorizontalScroll + ENTRY_BUFFER + EXIT_BUFFER;
      setContainerHeight(window.innerHeight + totalScrollSpan);
    };

    updateDimensions();
    const timer1 = setTimeout(updateDimensions, 100);
    const timer2 = setTimeout(updateDimensions, 400);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [tenCountries]);

  // Sticky Scroll Driver: Accurate Entry & Exit Points
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current || !trackRef.current.parentElement) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalVerticalScroll = containerRef.current.offsetHeight - window.innerHeight;

      if (totalVerticalScroll <= 0) return;

      const trackWidth = trackRef.current.scrollWidth;
      const clientWidth = trackRef.current.parentElement.clientWidth;
      const maxHorizontalScroll = Math.max(0, trackWidth - clientWidth + 30);

      // Distance scrolled past the entry point of the section
      const scrolledInContainer = -rect.top;

      let progress = 0;
      if (scrolledInContainer <= ENTRY_BUFFER) {
        // Entry point: cards stay at start so user sees Card 1 clearly
        progress = 0;
      } else if (scrolledInContainer >= totalVerticalScroll - EXIT_BUFFER) {
        // Exit point: View More card sits fully in view
        progress = 1;
      } else {
        // Active horizontal slide between Card 1 and View More card
        progress = (scrolledInContainer - ENTRY_BUFFER) / (totalVerticalScroll - ENTRY_BUFFER - EXIT_BUFFER);
      }

      const clampedProgress = Math.min(1, Math.max(0, progress));
      setScrollProgress(clampedProgress);

      const targetX = clampedProgress * maxHorizontalScroll;
      trackRef.current.style.transform = `translate3d(-${targetX}px, 0, 0)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerHeight]);

  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      window.scrollBy({ top: e.deltaX * 1.2 });
    }
  };

  // Nav buttons (click to slide 1 card step)
  const handleScrollStep = (direction) => {
    if (!trackRef.current || !containerRef.current) return;
    const totalVerticalScroll = containerRef.current.offsetHeight - window.innerHeight;
    const step = (totalVerticalScroll - ENTRY_BUFFER - EXIT_BUFFER) / 10;
    const targetY = window.scrollY + direction * step;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full bg-white select-none"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky Viewport Container - pt-20/pt-24 guarantees navbar never covers the header */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between pt-20 sm:pt-24 pb-6 md:pb-8 overflow-hidden z-10 bg-white">
        
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gray-50 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header Row - Restored to previous max-w-7xl mx-auto and padding */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-14 flex flex-col sm:flex-row sm:items-end justify-between gap-3 shrink-0">
          <div>
            <p className="text-xs md:text-sm font-semibold tracking-[0.15em] text-red-600 uppercase mb-1.5">
              / COUNTRIES WE OFFER
            </p>
            <h2 className="text-2xl sm:text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] font-bold text-[#2c3e50] leading-[1.2] tracking-[-0.015em]">
              Countries We Support for Immigration.
            </h2>
          </div>

          {/* Right Header Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScrollStep(-1)}
              aria-label="Previous countries"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF5252] hover:text-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScrollStep(1)}
              aria-label="Next countries"
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#FF5252] hover:text-white text-gray-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Center Track: Horizontal Liquid-Morphic Cards Track with less padding */}
        <div className="relative w-full flex items-center my-auto overflow-hidden py-1 px-4 sm:px-6">
          <div
            ref={trackRef}
            className="flex items-center gap-6 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {tenCountries.map((country, index) => {
              const countryUrl = country.id
                ? `/country/${encodeBase64Url(String(country.id))}`
                : `/country`;

              return (
                <Link
                  key={country.id || country.name || index}
                  to={countryUrl}
                  className="w-[calc(100vw-32px)] sm:w-[calc((100vw-72px)/2)] lg:w-[calc((100vw-96px)/3)] max-w-[560px] h-[375px] md:h-[395px] shrink-0 block group"
                >
                  {/* Clean Liquid-Morphic Card - Images & Name */}
                  <div className="relative w-full h-full rounded-[1.4rem] p-2 flex flex-col justify-between overflow-hidden bg-white/90 backdrop-blur-xl border border-gray-200/80 hover:border-gray-300 transition-all duration-300">
                    
                    {/* Scenic Destination Image */}
                    <div className="relative h-[290px] md:h-[310px] w-full rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={country.image}
                        alt={country.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                      />

                      {/* Gentle bottom shadow gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                      {/* Top Right: Enlarged Circular Flag Badge */}
                      <div className="absolute top-3.5 right-3.5 w-11 h-11 p-0.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border-2 border-white flex items-center justify-center overflow-hidden">
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      {/* Bottom Left: Liquid Continent Pill with Premium Grey Text */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[11px] font-semibold text-slate-700 uppercase tracking-wider border border-white/90 shadow-xs flex items-center gap-1.5">
                          <MapPin size={11} className="text-slate-500" />
                          {country.continent}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Clean Info: Country Name & Subtitle */}
                    <div className="px-3 py-2 flex flex-col justify-center">
                      <h3 className="text-lg md:text-[20px] font-bold text-gray-900 group-hover:text-slate-950 transition-colors tracking-tight leading-tight">
                        {country.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        Visa &amp; Immigration Support
                      </p>
                    </div>

                  </div>
                </Link>
              );
            })}

            {/* 11th Item: Minimal Aesthetic "View More" Arrow & Text in Grey */}
            <Link
              to="/country"
              aria-label="View more countries"
              className="flex flex-col items-center justify-center gap-3 shrink-0 px-6 sm:px-10 group cursor-pointer select-none"
            >
              <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_35px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95">
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform text-slate-600 group-hover:text-slate-900" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors tracking-tight">
                View More
              </span>
            </Link>

          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-14 shrink-0 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gray-50 border border-gray-200/60 text-[10px] sm:text-[11px] font-semibold text-gray-500 tracking-wide">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>TOP RATED BY CUSTOMERS &amp; IMMIGRATION FIRMS WITH 100% SUCCESS RATE.</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CountrySupportSection;
