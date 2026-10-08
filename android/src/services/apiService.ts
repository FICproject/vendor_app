import { Platform } from 'react-native';
import { API_URL_ANDROID, API_URL_IOS } from './env';
import { BusinessItem, CategoryKey } from '../../../App';

declare var global: any;

const BASE_URL = Platform.OS === 'android' ? API_URL_ANDROID : API_URL_IOS;

const getGlobalToken = (): string | null => {
  return (global as any).jwtToken || null;
};

const setGlobalToken = (token: string | null) => {
  (global as any).jwtToken = token;
};

let persistentVendorUser: any = null;

const getGlobalUser = (): any => {
  return persistentVendorUser || (global as any).currentVendorUser || null;
};

const setGlobalUser = (user: any) => {
  persistentVendorUser = user;
  (global as any).currentVendorUser = user;
};

const getGlobalActiveBusinessId = (): string | null => {
  return (global as any).activeBusinessId || null;
};

const setGlobalActiveBusinessId = (id: string | null) => {
  (global as any).activeBusinessId = id;
};

export const setToken = (token: string | null) => {
  setGlobalToken(token);
};

export const getToken = () => getGlobalToken();

export const setVendorUser = (user: any) => {
  if (user && user.businesses && user.businesses.length > 0) {
    const activeId = getGlobalActiveBusinessId() || user.primaryBusinessId || user.businesses[0]._id;
    setGlobalActiveBusinessId(activeId);
    const activeBiz = user.businesses.find((b: any) => b._id === activeId) || user.businesses[0];
    if (activeBiz) {
      user.vendorType = activeBiz.vendorType;
      user.category = activeBiz.category;
      user.subcategory = activeBiz.subcategory;
      user.baseVendorType = activeBiz.baseVendorType;
      user.businessName = activeBiz.businessName;
      user.logo = activeBiz.logo;
      user.businessLicense = activeBiz.businessLicense;
      user.businessImages = activeBiz.businessImages;
    }
  }
  setGlobalUser(user);
};

const DEFAULT_INITIAL_USER = {
  _id: 'vendor_123',
  name: 'Vendor',
  email: 'karthikeyan@vendor.com',
  phone: '+91 9876543210',
  businessName: 'Products',
  membershipPlan: 'Gold',
  vendorType: 'Products',
  category: 'Products',
  subcategory: 'General',
  primaryBusinessId: 'dummy_biz_1',
  businesses: [
    {
      _id: 'dummy_biz_1',
      businessName: 'Products',
      vendorType: 'Products',
      category: 'Fashion',
      subcategory: 'Apparel',
      logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_2',
      businessName: 'Services',
      vendorType: 'Services',
      category: 'Services',
      subcategory: 'Home Services',
      logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_3',
      businessName: 'Food',
      vendorType: 'Food',
      category: 'Food',
      subcategory: 'North Indian',
      logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_4',
      businessName: 'Travel',
      vendorType: 'Travel',
      category: 'Travel',
      subcategory: 'Bus & Cab Rental',
      logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_5',
      businessName: 'Stay',
      vendorType: 'Stay',
      category: 'Stay',
      subcategory: 'Hotels & Luxury Resorts',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_6',
      businessName: 'Jobs',
      vendorType: 'Jobs',
      category: 'Jobs',
      subcategory: 'Full Time & IT Staffing',
      logo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=150&q=80',
    },
    {
      _id: 'dummy_biz_7',
      businessName: 'Daily Needs',
      vendorType: 'Daily Needs',
      category: 'Daily Needs',
      subcategory: 'Grocery Essentials',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
    },
  ],
};

export const getVendorUser = () => {
  let user = getGlobalUser();
  if (!user) {
    user = DEFAULT_INITIAL_USER;
    setGlobalUser(user);
  }
  return user;
};

export const getActiveBusinessId = () => getGlobalActiveBusinessId();
export const setActiveBusinessId = (id: string | null) => {
  setGlobalActiveBusinessId(id);
  const user = getGlobalUser();
  if (user && user.businesses && id) {
    const activeBiz = user.businesses.find((b: any) => b._id === id);
    if (activeBiz) {
      user.vendorType = activeBiz.vendorType;
      user.category = activeBiz.category;
      user.subcategory = activeBiz.subcategory;
      user.baseVendorType = activeBiz.baseVendorType;
      user.businessName = activeBiz.businessName;
      user.logo = activeBiz.logo;
      user.businessLicense = activeBiz.businessLicense;
      user.businessImages = activeBiz.businessImages;
      setGlobalUser(user);
    }
  }
};

let cachedWorkingBaseUrl: string | null = null;

export const getCandidateBaseUrls = (): string[] => {
  const list: string[] = [];
  if (cachedWorkingBaseUrl) {
    list.push(cachedWorkingBaseUrl);
  }
  // 1. localhost & 127.0.0.1 (instant when adb reverse tcp:5000 tcp:5000 is active)
  list.push('http://localhost:5000/api');
  list.push('http://127.0.0.1:5000/api');
  // 2. Current Host PC Wi-Fi LAN IP
  list.push('http://10.173.136.164:5000/api');
  // 3. Android Emulator loopback
  list.push('http://10.0.2.2:5000/api');
  // 4. Configured BASE_URL from env
  if (BASE_URL) {
    list.push(BASE_URL);
  }
  return Array.from(new Set(list));
};

const apiRequest = async (endpoint: string, options: any = {}) => {
  const token = getGlobalToken() || 'jwt_mongo_default';
  const activeBusinessId = getGlobalActiveBusinessId();
  const user = getGlobalUser();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(activeBusinessId ? { 'x-business-id': activeBusinessId } : {}),
    ...(user?.email ? { 'x-vendor-email': user.email } : { 'x-vendor-email': 'karthikeyan@vendor.com' }),
    ...(options.headers || {}),
  };

  let lastError: any = null;
  const candidates = getCandidateBaseUrls();

  // Try candidate URLs to handle physical device, adb reverse, and local network IP
  for (const baseUrl of candidates) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2500) : null;
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
        ...(controller ? { signal: controller.signal } : {}),
      });
      if (timeoutId) clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      // Remember the working URL for instantaneous subsequent calls
      cachedWorkingBaseUrl = baseUrl;
      return data;
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      lastError = err;
    }
  }

  if (lastError?.name === 'AbortError' || lastError?.message === 'Aborted') {
    throw new Error('Server response timed out. Please check your network connection.');
  }
  throw lastError || new Error('Network connection error');
};

/**
 * Upload a local image file or base64 data to the backend and get back a public HTTP URL.
 * Optimized for speed: uses discovered working URL and parallel/short timeout checks.
 */
export const uploadImageToServer = async (
  imageInput: { base64?: string; localUri?: string; mimeType?: string } | string,
  optionalMimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    let base64String = '';
    let mimeType = optionalMimeType;
    let localUri = '';

    if (typeof imageInput === 'string') {
      if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
        return imageInput; // Already a remote public URL
      } else if (imageInput.startsWith('data:image/')) {
        base64String = imageInput.replace(/^data:image\/\w+;base64,/, '');
      } else {
        localUri = imageInput;
      }
    } else if (imageInput && typeof imageInput === 'object') {
      base64String = imageInput.base64 ? imageInput.base64.replace(/^data:image\/\w+;base64,/, '') : '';
      mimeType = imageInput.mimeType || optionalMimeType;
      localUri = imageInput.localUri || '';
    }

    const candidateUrls = getCandidateBaseUrls();
    const filename = `product_${Date.now()}`;

    // Fast attempt helper with 3000ms timeout per candidate
    const tryUploadToUrl = async (baseUrl: string, b64: string): Promise<string | null> => {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null;
      try {
        const uploadRes = await fetch(`${baseUrl}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: b64, mimeType, filename }),
          ...(controller ? { signal: controller.signal } : {}),
        });
        if (timeoutId) clearTimeout(timeoutId);
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data.success && data.url) {
            cachedWorkingBaseUrl = baseUrl;
            return data.url;
          }
        }
      } catch {
        if (timeoutId) clearTimeout(timeoutId);
      }
      return null;
    };

    // If base64 is available (from react-native-image-picker includeBase64: true)
    if (base64String && base64String.trim().length > 0) {
      for (const baseUrl of candidateUrls) {
        const uploaded = await tryUploadToUrl(baseUrl, base64String);
        if (uploaded) return uploaded;
      }
    }

    // Fallback: If only localUri is present, try reading via fetch blob
    if (localUri && !base64String) {
      try {
        const response = await fetch(localUri);
        const blob = await response.blob();
        const readBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const res = (reader.result as string || '');
            resolve(res.split(',')[1] || res);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (readBase64) {
          for (const baseUrl of candidateUrls) {
            const uploaded = await tryUploadToUrl(baseUrl, readBase64);
            if (uploaded) return uploaded;
          }
        }
      } catch (blobErr) {
        console.warn('[uploadImageToServer] Fallback blob read failed:', blobErr);
      }
    }

    return localUri || '';
  } catch (err) {
    console.warn('[uploadImageToServer] Error:', err);
    return typeof imageInput === 'string' ? imageInput : (imageInput?.localUri || '');
  }
};

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';

// Map API product response to App's BusinessItem
// Map API product response to App's BusinessItem
export const mapApiProductToBusinessItem = (product: any, categoryFallback: CategoryKey = 'Products'): BusinessItem => {
  const resolvedCategory = (product.vendorType || product.category || categoryFallback) as CategoryKey;
  const isJob = resolvedCategory === 'Jobs';

  let displayPrice = '₹0';
  if (isJob) {
    if (product.salaryPackage) {
      displayPrice = String(product.salaryPackage).startsWith('₹') ? String(product.salaryPackage) : `₹${product.salaryPackage}`;
    } else if (typeof product.price === 'number' && product.price > 0) {
      if (product.price >= 10000) {
        displayPrice = `₹${(product.price / 100000).toFixed(1).replace(/\.0$/, '')} LPA`;
      } else {
        displayPrice = `₹${product.price} LPA`;
      }
    } else if (product.price) {
      displayPrice = String(product.price).startsWith('₹') ? String(product.price) : `₹${product.price}`;
    } else {
      displayPrice = '₹5.5 LPA';
    }
  } else {
    displayPrice = typeof product.price === 'number' ? `₹${product.price}` : (product.price ? (String(product.price).startsWith('₹') ? String(product.price) : `₹${product.price}`) : '₹0');
  }

  const salPkg = product.salaryPackage || (isJob ? displayPrice.replace(/^₹\s*/, '') : undefined);

  return {
    id: product._id || product.id,
    name: product.name,
    detail: product.jobDescription || product.description || product.detail || '',
    price: displayPrice,
    originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? `₹${product.originalPrice}` : String(product.originalPrice)) : undefined,
    isActive: product.status === 'Available',
    category: resolvedCategory,
    image: (() => {
      if (resolvedCategory === 'Jobs') return '';
      let img = product.imageUrl || product.image || DEFAULT_FALLBACK_IMAGE;
      if (typeof img === 'string' && img.includes('/uploads/')) {
        img = img.replace(/http:\/\/[^\/]+\/uploads\//, 'http://192.168.0.139:5000/uploads/');
      }
      return img;
    })(),
    subCategory: product.subCategory || product.subcategory || 'General',
    itemType: product.itemType || product.specialization || product.roomType || product.foodType || '',
    unit: product.unit || 'count',
    stock: String(product.stock || product.vacancies || 0),
    pinCode: product.pinCode || '',
    // Category-specific fields
    selectedAmenities: product.selectedAmenities || product.amenities || [],
    amenities: product.amenities || product.selectedAmenities || [],
    roomClass: product.roomClass || product.roomType || 'Standard',
    numberOfGuests: String(product.numberOfGuests || '2'),
    // Stay specific fields
    hotelName: product.hotelName || product.name || '',
    stayCity: product.stayCity || product.locationCity || '',
    locationCity: product.locationCity || product.stayCity || '',
    stayAddress: product.stayAddress || product.location || '',
    location: product.location || product.stayAddress || '',
    bedType: product.bedType || '',
    roomSize: product.roomSize || '',
    roomView: product.roomView || '',
    checkInTime: product.checkInTime || '',
    checkOutTime: product.checkOutTime || '',
    starRating: product.starRating,
    freeCancellation: product.freeCancellation,
    freeBreakfast: product.freeBreakfast,
    coupleFriendly: product.coupleFriendly,
    payAtHotel: product.payAtHotel,
    propertyType: product.propertyType || '',
    childCategory: product.childCategory || product.itemType || '',
    boardingPoint: product.boardingPoint || '',
    boardingTime: product.boardingTime || '',
    dropPoint: product.dropPoint || '',
    arrivalTime: product.arrivalTime || '',
    totalDistance: product.totalDistance || '',
    busSchedule: product.busSchedule || '',
    routeStops: product.routeStops || [],
    // Travel specific fields
    operator: product.operator || product.operatorName || product.vendorName || product.businessName || '',
    operatorName: product.operatorName || product.operator || product.vendorName || product.businessName || '',
    from: product.from || product.origin || '',
    to: product.to || product.destination || '',
    origin: product.origin || product.from || '',
    destination: product.destination || product.to || '',
    departureTime: product.departureTime || product.boardingTime || '',
    duration: product.duration || product.busSchedule || '',
    badge: product.badge || '',
    vehicleNumber: product.vehicleNumber || product.vehicleRegNo || product.busNumber || '',
    vehicleRegNo: product.vehicleRegNo || product.vehicleNumber || product.busNumber || '',
    busNumber: product.busNumber || product.vehicleNumber || product.vehicleRegNo || '',
    seatsLeft: product.seatsLeft ? Number(product.seatsLeft) : (product.stock ? Number(product.stock) : 12),
    foodType: product.foodType || '',
    preparationTime: product.preparationTime || '',
    // Job fields
    jobType: product.jobType || 'Full-time',
    jobLocation: product.jobLocation || '',
    experienceRequired: product.experienceRequired || product.experienceLevel || '',
    salaryPackage: salPkg,
    skillsRequirement: Array.isArray(product.skillsRequirement) ? product.skillsRequirement.join(', ') : (product.skillsRequirement || ''),
    jobDescription: product.jobDescription || product.description || product.detail || '',
    deadlineDate: product.deadlineDate || '',
    applicationTips: product.applicationTips || '',
    qualificationRequired: product.qualificationRequired || product.qualification || '',
    linkedProfileUrl: product.linkedProfileUrl || '',
    companyName: isJob ? (product.companyName || product.vendorName || product.businessName || '') : undefined,
    companyWebsite: isJob ? (product.companyWebsite || '') : undefined,
    contactNumber: product.contactNumber || '',
    mailId: product.mailId || '',
    vacancies: String(product.vacancies || product.stock || '10'),
    salaryPeriod: product.salaryPeriod || '',
    experienceLevel: product.experienceLevel || product.experienceRequired || '',
    qualification: product.qualification || product.qualificationRequired || '',
    jobID: isJob ? (product.jobID || (product.id ? `JOB-${String(product.id).slice(-6)}` : '')) : undefined,
    keyResponsibilities: product.keyResponsibilities || product.responsibilities || '',
  };
};

// Map App's BusinessItem to API product payload
export const mapBusinessItemToApiProduct = (item: Partial<BusinessItem>, vendorUser: any) => {
  let priceNum = 0;
  const isJob = item.category === 'Jobs' || (item as any).vendorType === 'Jobs';
  if (isJob) {
    const salStr = item.salaryPackage || item.price || '';
    const matchLpa = String(salStr).match(/([\d.]+)\s*lpa/i);
    if (matchLpa) {
      priceNum = Math.round(parseFloat(matchLpa[1]) * 100000);
    } else {
      const parsed = parseFloat(String(salStr).replace(/[^\d.]/g, ''));
      if (!isNaN(parsed)) {
        priceNum = parsed <= 150 ? Math.round(parsed * 100000) : Math.round(parsed);
      }
    }
  } else {
    priceNum = item.price ? Number(String(item.price).replace(/[^\d]/g, '')) : 0;
  }
  const origPriceNum = item.originalPrice ? Number(String(item.originalPrice).replace(/[^\d]/g, '')) : undefined;

  const validImage = isJob
    ? ''
    : ((item.image && String(item.image).trim().length > 0)
        ? item.image
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80');

  return {
    name: item.name,
    description: item.jobDescription || item.detail,
    detail: item.jobDescription || item.detail,
    price: priceNum,
    originalPrice: origPriceNum,
    category: item.category || 'Products',
    vendorType: item.category || 'Products',
    subCategory: item.subCategory || 'General',
    subcategory: item.subCategory || 'General',
    itemType: item.itemType || '',
    stock: item.stock ? Number(item.stock) : (item.vacancies ? Number(item.vacancies) : 0),
    unit: item.unit || 'count',
    status: item.isActive !== false ? 'Available' : 'Out of Stock',
    image: validImage,
    imageUrl: validImage,
    pinCode: item.pinCode || vendorUser?.postalCode || '',
    foodType: item.category === 'Food' ? (item.foodType || item.itemType) : undefined,
    roomType: item.category === 'Stay' ? (item.roomClass || item.itemType) : undefined,
    roomClass: item.roomClass,
    numberOfGuests: item.numberOfGuests,
    selectedAmenities: item.selectedAmenities || item.amenities || [],
    amenities: item.amenities || item.selectedAmenities || [],
    // Stay specific fields for Customer App sync
    hotelName: item.hotelName || item.name,
    stayCity: item.stayCity || item.locationCity || 'Bangalore',
    locationCity: item.locationCity || item.stayCity || 'Bangalore',
    stayAddress: item.stayAddress || item.location || '',
    location: item.location || item.stayAddress || '',
    bedType: item.bedType,
    roomSize: item.roomSize,
    roomView: item.roomView,
    checkInTime: item.checkInTime || '12:00 PM',
    checkOutTime: item.checkOutTime || '11:00 AM',
    starRating: item.starRating,
    propertyType: item.propertyType,
    childCategory: item.childCategory || item.itemType,
    freeCancellation: item.freeCancellation,
    freeBreakfast: item.freeBreakfast,
    coupleFriendly: item.coupleFriendly,
    payAtHotel: item.payAtHotel,
    boardingPoint: item.boardingPoint,
    boardingTime: item.boardingTime,
    boardingPoints: item.boardingPoints && item.boardingPoints.length > 0
      ? item.boardingPoints
      : (item.boardingPoint ? [item.boardingPoint] : ['Bangalore (Majestic 21:30)']),
    dropPoint: item.dropPoint,
    arrivalTime: item.arrivalTime,
    dropPoints: item.droppingPoints || item.dropPoints || (item.dropPoint ? [item.dropPoint] : ['Chennai (Koyambedu 05:30)']),
    droppingPoints: item.droppingPoints || item.dropPoints || (item.dropPoint ? [item.dropPoint] : ['Chennai (Koyambedu 05:30)']),
    totalDistance: item.totalDistance,
    busSchedule: item.busSchedule || item.duration,
    routeStops: item.routeStops,
    // Travel specific fields for Customer App sync
    from: item.from || item.origin || (typeof item.boardingPoint === 'string' ? item.boardingPoint.split('(')[0]?.trim() : 'Bangalore'),
    to: item.to || item.destination || (typeof item.dropPoint === 'string' ? item.dropPoint.split('(')[0]?.trim() : 'Chennai'),
    origin: item.origin || item.from || (typeof item.boardingPoint === 'string' ? item.boardingPoint.split('(')[0]?.trim() : 'Bangalore'),
    destination: item.destination || item.to || (typeof item.dropPoint === 'string' ? item.dropPoint.split('(')[0]?.trim() : 'Chennai'),
    departureTime: item.departureTime || item.boardingTime || '21:30',
    duration: item.duration || item.busSchedule || '8h 00m',
    badge: item.badge || 'Top Rated Bus',
    operator: item.operator || item.operatorName || vendorUser?.businessName || vendorUser?.name || 'Verified Travels',
    operatorName: item.operatorName || item.operator || vendorUser?.businessName || vendorUser?.name || 'Verified Travels',
    vendorName: item.operatorName || item.operator || vendorUser?.businessName || vendorUser?.name || 'Verified Travels',
    bus_name: item.name,
    bus_type: item.subCategory || 'AC Sleeper',
    subType: item.subCategory || 'AC Sleeper',
    seatsLeft: item.stock ? Number(item.stock) : 12,
    vehicleNumber: item.vehicleNumber || item.vehicleRegNo || item.busNumber || '',
    vehicleRegNo: item.vehicleRegNo || item.vehicleNumber || item.busNumber || '',
    busNumber: item.busNumber || item.vehicleNumber || item.vehicleRegNo || '',
    // Job fields
    jobType: item.jobType,
    jobLocation: item.jobLocation,
    experienceRequired: item.experienceRequired,
    salaryPackage: item.salaryPackage,
    skillsRequirement: item.skillsRequirement,
    jobDescription: item.jobDescription || item.detail,
    deadlineDate: item.deadlineDate,
    applicationTips: item.applicationTips,
    qualificationRequired: item.qualificationRequired,
    linkedProfileUrl: item.linkedProfileUrl,
    companyName: item.companyName,
    companyWebsite: item.companyWebsite,
    contactNumber: item.contactNumber,
    mailId: item.mailId,
    vacancies: item.vacancies || String(item.stock || '10'),
    salaryPeriod: item.salaryPeriod || (item.salaryPackage ? 'per year' : ''),
    experienceLevel: item.experienceLevel || item.experienceRequired,
    qualification: item.qualification || item.qualificationRequired,
    preparationTime: item.preparationTime,
    specialization: item.category === 'Services' ? item.itemType : undefined,
    jobID: item.jobID,
    keyResponsibilities: item.keyResponsibilities,
  };
};

import { mongoDB } from './mongoDatabase';

// --- API Calls ---

// Auth
export const loginVendor = async (email: string, password: string) => {
  const data = await apiRequest('/auth/login-vendor', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data && data.success) {
    setToken(data.token);
    setVendorUser(data.user);
  }
  return data;
};

export const registerVendor = async (payload: any) => {
  const data = await apiRequest('/auth/register-vendor', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
};

// Catalog / Products
export const fetchProducts = async (): Promise<BusinessItem[]> => {
  const data = await apiRequest('/vendor/products', {
    method: 'GET',
  });
  const category = (getVendorUser()?.vendorType || 'Products') as CategoryKey;
  if (data && data.data) {
    return (data.data || []).map((prod: any) => mapApiProductToBusinessItem(prod, category));
  }
  return [];
};

export const fetchAllBusinessesProducts = async (): Promise<BusinessItem[]> => {
  try {
    const data = await apiRequest('/vendor/products', {
      method: 'GET',
    });
    if (data && data.data) {
      return (data.data || []).map((prod: any) => mapApiProductToBusinessItem(prod, prod.vendorType || prod.category || 'Products'));
    }
  } catch (err) {
    console.warn('Error fetching products from MongoDB Atlas:', err);
  }
  return [];
};

export const createProduct = async (item: Partial<BusinessItem>): Promise<BusinessItem> => {
  const payload = mapBusinessItemToApiProduct(item, getVendorUser());
  const data = await apiRequest('/vendor/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const category = (item.category || data?.data?.category || getVendorUser()?.vendorType || 'Products') as CategoryKey;
  if (data && data.data) {
    return mapApiProductToBusinessItem(data.data, category);
  }
  throw new Error('Failed to create product in MongoDB Atlas');
};

export const updateProduct = async (id: string, item: Partial<BusinessItem>): Promise<BusinessItem> => {
  const payload = mapBusinessItemToApiProduct(item, getVendorUser());
  const data = await apiRequest(`/vendor/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const category = (item.category || data?.data?.category || getVendorUser()?.vendorType || 'Products') as CategoryKey;
  if (data && data.data) {
    return mapApiProductToBusinessItem(data.data, category);
  }
  throw new Error('Failed to update product in MongoDB Atlas');
};

export const deleteProduct = async (id: string) => {
  const data = await apiRequest(`/vendor/products/${id}`, {
    method: 'DELETE',
  });
  return data;
};

export interface CustomerItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

export const fetchCustomers = async (): Promise<CustomerItem[]> => {
  const data = await apiRequest('/vendor/customers', {
    method: 'GET',
  });
  if (data && data.success && data.data) {
    return data.data.map((c: any) => ({
      id: c._id || c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      ordersCount: c.ordersCount || 0,
      totalSpent: c.totalSpent || 0,
    }));
  }
  return [];
};

// Orders
export const fetchOrders = async () => {
  const data = await apiRequest('/vendor/orders', {
    method: 'GET',
  });
  if (data && data.data) {
    return data.data;
  }
  return [];
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  extraData?: {
    seat?: string;
    allocated_seat?: string;
    travelers?: any[];
    bus_name?: string;
  }
) => {
  const data = await apiRequest(`/vendor/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, ...(extraData || {}) }),
  });
  return data;
};

export const addLocalOrder = async (order: any) => {
  const data = await apiRequest('/vendor/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
  return data && data.data ? data.data : data;
};

// Analytics
export const fetchAnalytics = async () => {
  const data = await apiRequest('/vendor/analytics', {
    method: 'GET',
  });
  if (data && data.data) {
    return data.data;
  }
  return { totalOrdersCount: 0, totalRevenue: 0, totalItemsCount: 0, activeMembershipsCount: 1 };
};

// Profile
export const fetchProfile = async () => {
  const data = await apiRequest('/vendor/profile', {
    method: 'GET',
  });
  if (data && data.success) {
    setVendorUser(data.user);
    return data;
  }
  return { success: false, message: 'Failed to fetch profile' };
};

export const updateProfile = async (payload: any) => {
  const data = await apiRequest('/vendor/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (data && data.success) {
    setVendorUser(data.user);
    return data;
  }
  return data;
};

// Business Creation & Deletion
export const createBusiness = async (payload: { businessName: string; vendorType: string; category: string; subcategory: string }) => {
  const data = await apiRequest('/vendor/business', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (data && data.success && data.user) {
    setVendorUser(data.user);
    return data;
  }
  return data;
};

export const deleteBusiness = async (businessId: string) => {
  const data = await apiRequest(`/vendor/business/${businessId}`, { method: 'DELETE' });
  if (data && data.user) {
    setVendorUser(data.user);
  }
  return data;
};
