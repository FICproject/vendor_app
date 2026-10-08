import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import tw from 'twrnc';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  screenName?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ScreenErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`[ScreenErrorBoundary] Error in ${this.props.screenName || 'Screen'}:`, error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(239, 68, 68, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 32 }}>⚠️</Text>
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
            Unable to load {this.props.screenName || 'screen'}
          </Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 20, textAlign: 'center', paddingHorizontal: 16 }}>
            {this.state.error?.message || 'A temporary rendering error occurred.'}
          </Text>
          <TouchableOpacity
            onPress={this.resetError}
            style={{ backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Reload Screen</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
import {
  Home,
  ClipboardList,
  Store,
  User,
  TrendingUp,
} from 'lucide-react-native';

// Screens
import HomeScreen from './android/src/screens/HomeScreen';
import OrdersScreen from './android/src/screens/OrdersScreen';
import BusinessScreen from './android/src/screens/BusinessScreen';
import PaymentsScreen from './android/src/screens/PaymentsScreen';
import ProfileScreen from './android/src/screens/ProfileScreen';
import LoginScreen from './android/src/screens/LoginScreen';
import SignupScreen from './android/src/screens/SignupScreen';
import DeliveryPartnersScreen from './android/src/screens/DeliveryPartnersScreen';
import SplashScreen from './android/src/screens/SplashScreen';

export type CategoryKey = 'Products' | 'Services' | 'Food' | 'Travel' | 'Stay' | 'Jobs' | 'Daily Needs';

export interface BusinessItem {
  id: string;
  name: string;
  detail: string;
  price: string;
  originalPrice?: string;
  isActive: boolean;
  category: CategoryKey;
  image: string;
  subCategory?: string;
  itemType?: string;
  unit?: string;
  stock?: string;
  pinCode?: string;
  // Category-specific fields
  selectedAmenities?: string[];
  amenities?: string[];
  roomClass?: string;
  numberOfGuests?: string;
  boardingPoint?: string;
  boardingTime?: string;
  additionalBoardingPoints?: { point: string; time: string }[];
  boardingPoints?: string[];
  dropPoint?: string;
  arrivalTime?: string;
  additionalDropPoints?: { point: string; time: string }[];
  dropPoints?: string[];
  droppingPoints?: string[];
  totalDistance?: string;
  busSchedule?: string;
  routeStops?: { stopName: string; time: string }[];
  // Travel Specific Fields
  operator?: string;
  operatorName?: string;
  from?: string;
  to?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  duration?: string;
  badge?: string;
  vehicleNumber?: string;
  vehicleRegNo?: string;
  busNumber?: string;
  seatsLeft?: number;
  foodType?: string;
  preparationTime?: string;
  jobType?: string;
  salaryPeriod?: string;
  experienceLevel?: string;
  qualification?: string;
  jobLocation?: string;
  experienceRequired?: string;
  salaryPackage?: string;
  skillsRequirement?: string;
  jobDescription?: string;
  keyResponsibilities?: string;
  deadlineDate?: string;
  applicationTips?: string;
  qualificationRequired?: string;
  linkedProfileUrl?: string;
  contactNumber?: string;
  mailId?: string;
  vacancies?: string;
  jobID?: string;
  companyName?: string;
  companyWebsite?: string;
  // Stay Specific Fields
  hotelName?: string;
  stayCity?: string;
  locationCity?: string;
  stayAddress?: string;
  location?: string;
  bedType?: string;
  roomSize?: string;
  roomView?: string;
  checkInTime?: string;
  checkOutTime?: string;
  starRating?: number;
  freeCancellation?: boolean;
  freeBreakfast?: boolean;
  coupleFriendly?: boolean;
  payAtHotel?: boolean;
  deliveryTime?: string;
  [key: string]: any;
}

import { setToken, setVendorUser, fetchProfile, fetchAllBusinessesProducts } from './android/src/services/apiService';

type Tab = 'Home' | 'Orders' | 'Business' | 'Payments' | 'Profile' | 'DeliveryPartners';
type AuthScreen = 'login' | 'signup';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');
  const [businessItems, setBusinessItems] = useState<BusinessItem[]>([]);
  const [purchasedTier, setPurchasedTier] = useState<'Silver' | 'Gold' | 'Diamond'>('Silver');

  // Auth handlers
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    // Dynamically set purchased tier from user plan
    const tier = user.membershipPlan === 'Gold' ? 'Gold' : user.membershipPlan === 'Diamond' ? 'Diamond' : 'Silver';
    setPurchasedTier(tier);
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    setAuthScreen('login');
  };

  const handleNavigateToSignup = () => {
    setAuthScreen('signup');
  };

  const handleNavigateToLogin = () => {
    setAuthScreen('login');
  };

  const handleLogout = () => {
    setToken(null);
    setVendorUser(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('Home'); // Reset active tab when logging out
  };
  
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [businessTabParams, setBusinessTabParams] = useState<any>(null);

  const handleNavigate = (tab: Tab, params?: any) => {
    if (tab === 'Business') {
      setBusinessTabParams(params || null);
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const loadAllData = async () => {
        try {
          const profRes = await fetchProfile();
          if (profRes && profRes.user) {
            setCurrentUser(profRes.user);
            if (profRes.user.membershipPlan) {
              const tier = profRes.user.membershipPlan === 'Gold' ? 'Gold' : profRes.user.membershipPlan === 'Diamond' ? 'Diamond' : 'Silver';
              setPurchasedTier(tier);
            }
          }
          const items = await fetchAllBusinessesProducts();
          setBusinessItems(Array.isArray(items) ? items : []);
        } catch (err) {
          console.warn('Failed to load profile/products:', err);
        }
      };
      loadAllData();
    }
  }, [isLoggedIn, activeTab]);

  const renderScreen = () => {
    let screenContent: React.ReactNode;
    switch (activeTab) {
      case 'Home':
        screenContent = (
          <HomeScreen
            items={businessItems}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            isDark={isDark}
            purchasedTier={purchasedTier}
          />
        );
        break;
      case 'Orders':
        screenContent = <OrdersScreen isDark={isDark} />;
        break;
      case 'Business':
        screenContent = (
          <BusinessScreen
            items={businessItems}
            setItems={setBusinessItems}
            isDark={isDark}
            routeParams={businessTabParams}
            clearRouteParams={() => setBusinessTabParams(null)}
          />
        );
        break;
      case 'Payments':
        screenContent = <PaymentsScreen isDark={isDark} />;
        break;
      case 'Profile':
        screenContent = (
          <ProfileScreen
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            isDark={isDark}
            purchasedTier={purchasedTier}
            setPurchasedTier={setPurchasedTier}
          />
        );
        break;
      case 'DeliveryPartners':
        screenContent = <DeliveryPartnersScreen onNavigate={handleNavigate} isDark={isDark} />;
        break;
      default:
        screenContent = (
          <HomeScreen
            items={businessItems}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            isDark={isDark}
            purchasedTier={purchasedTier}
          />
        );
        break;
    }
    return (
      <ScreenErrorBoundary screenName={activeTab} onReset={() => setActiveTab('Home')}>
        {screenContent}
      </ScreenErrorBoundary>
    );
  };

  const navItems = [
    {key: 'Home' as Tab, label: 'Home', icon: Home},
    {key: 'Orders' as Tab, label: 'Orders', icon: ClipboardList},
    {key: 'Business' as Tab, label: 'Business', icon: Store},
    {key: 'Payments' as Tab, label: 'Analytics', icon: TrendingUp},
    {key: 'Profile' as Tab, label: 'Profile', icon: User},
  ];

  return (
    <SafeAreaProvider>
      <ScreenErrorBoundary screenName="VendorMobile">
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : !isLoggedIn ? (
          <View style={tw`flex-1 bg-white`}>
            {authScreen === 'login' ? (
              <LoginScreen
                onLogin={handleLogin}
                onNavigateToSignup={handleNavigateToSignup}
              />
            ) : (
              <SignupScreen
                onSignup={handleSignup}
                onNavigateToLogin={handleNavigateToLogin}
              />
            )}
          </View>
        ) : (
          <View style={[tw`flex-1`, isDark ? tw`bg-zinc-950` : tw`bg-gray-50`]}>
            {/* Active Screen View */}
            <View style={tw`flex-1`}>
              {renderScreen()}
            </View>

            {/* Bottom Tab Bar */}
            <View
              style={[
                tw`flex-row justify-around pb-5 pt-2.5`,
                isDark ? tw`bg-zinc-900 border-t border-zinc-800` : tw`bg-white border-t border-gray-150`,
                {
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: -4},
                  shadowOpacity: isDark ? 0.2 : 0.05,
                  shadowRadius: 10,
                  elevation: 8,
                },
              ]}>
              {navItems.map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setActiveTab(item.key)}
                    activeOpacity={0.7}
                    style={tw`items-center justify-center w-16`}>
                    <View style={tw`p-1`}>
                      <IconComponent
                        size={22}
                        color={isActive ? '#4F46E5' : isDark ? '#71717a' : '#9CA3AF'}
                      />
                    </View>
                    <Text
                      style={[
                        tw`text-[10px] font-bold mt-0.5`,
                        isActive ? tw`text-indigo-600` : isDark ? tw`text-zinc-500` : tw`text-gray-400`,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScreenErrorBoundary>
    </SafeAreaProvider>
  );
}

export default App;
