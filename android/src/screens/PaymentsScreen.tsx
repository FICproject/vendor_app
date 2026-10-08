import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import tw from 'twrnc';
import {
  Calendar,
  ChevronDown,
  ShoppingBag,
  Eye,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
} from 'lucide-react-native';
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Line,
} from 'react-native-svg';

export default function PaymentsScreen({ isDark = false }: { isDark?: boolean }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tw`flex-1`, isDark ? tw`bg-zinc-950` : tw`bg-gray-50`]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#18181b' : '#FFFFFF'} />

      {/* Header Banner */}
      <View
        style={[
          isDark ? tw`bg-zinc-900 border-b border-zinc-800` : tw`bg-white px-5 pb-4`,
          tw`px-5 pb-4`,
          {paddingTop: insets.top + 12},
          {
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 3,
          },
        ]}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={[tw`text-2xl font-bold`, isDark ? tw`text-white` : tw`text-gray-900`]}>Analytics</Text>
          <TouchableOpacity style={[
            tw`flex-row items-center px-4 py-2.5 rounded-2xl shadow-sm`,
            isDark ? tw`bg-zinc-950 border border-zinc-800` : tw`bg-gray-50 border border-gray-100`
          ]}>
            <Calendar size={16} color="#4F46E5" />
            <Text style={[tw`font-semibold text-sm ml-2`, isDark ? tw`text-zinc-300` : tw`text-gray-700`]}>May 20 - May 26, 2024</Text>
            <ChevronDown size={14} color="#6B7280" style={tw`ml-1.5`} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pt-5 pb-8`}>

        {/* 2x2 Stats Grid */}
        <View style={tw`flex-row flex-wrap justify-between mb-5`}>
          {/* Revenue */}
          <View
            style={[
              tw`rounded-3xl p-5 mb-4`,
              isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
              {
                width: '48%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
              },
            ]}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <Text style={[tw`text-xs font-semibold`, isDark ? tw`text-zinc-500` : tw`text-gray-400`]}>Revenue</Text>
              <View style={[tw`w-8 h-8 rounded-xl items-center justify-center`, {backgroundColor: '#EEF2FF'}]}>
                <ShoppingBag size={18} color="#4F46E5" />
              </View>
            </View>
            <Text style={[tw`font-extrabold text-xl`, isDark ? tw`text-white` : tw`text-gray-900`]}>₹45,680</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <TrendingUp size={12} color="#16A34A" />
              <Text style={tw`text-green-600 text-xs font-bold ml-1`}>+ 16.4%</Text>
            </View>
          </View>

          {/* Orders */}
          <View
            style={[
              tw`rounded-3xl p-5 mb-4`,
              isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
              {
                width: '48%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
              },
            ]}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <Text style={[tw`text-xs font-semibold`, isDark ? tw`text-zinc-500` : tw`text-gray-400`]}>Orders</Text>
              <View style={[tw`w-8 h-8 rounded-xl items-center justify-center`, {backgroundColor: '#ECFDF5'}]}>
                <ClipboardList size={18} color="#10B981" />
              </View>
            </View>
            <Text style={[tw`font-extrabold text-xl`, isDark ? tw`text-white` : tw`text-gray-900`]}>128</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <TrendingUp size={12} color="#16A34A" />
              <Text style={tw`text-green-600 text-xs font-bold ml-1`}>+ 18.6%</Text>
            </View>
          </View>

          {/* Bookings */}
          <View
            style={[
              tw`rounded-3xl p-5`,
              isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
              {
                width: '48%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
              },
            ]}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <Text style={[tw`text-xs font-semibold`, isDark ? tw`text-zinc-500` : tw`text-gray-400`]}>Bookings</Text>
              <View style={[tw`w-8 h-8 rounded-xl items-center justify-center`, {backgroundColor: '#FFFBEB'}]}>
                <CalendarCheck size={18} color="#F59E0B" />
              </View>
            </View>
            <Text style={[tw`font-extrabold text-xl`, isDark ? tw`text-white` : tw`text-gray-900`]}>32</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <TrendingUp size={12} color="#16A34A" />
              <Text style={tw`text-green-600 text-xs font-bold ml-1`}>+ 11.1%</Text>
            </View>
          </View>

          {/* Visitors */}
          <View
            style={[
              tw`rounded-3xl p-5`,
              isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
              {
                width: '48%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.03,
                shadowRadius: 4,
                elevation: 1,
              },
            ]}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <Text style={[tw`text-xs font-semibold`, isDark ? tw`text-zinc-500` : tw`text-gray-400`]}>Visitors</Text>
              <View style={[tw`w-8 h-8 rounded-xl items-center justify-center`, {backgroundColor: '#FEF2F2'}]}>
                <Eye size={18} color="#EF4444" />
              </View>
            </View>
            <Text style={[tw`font-extrabold text-xl`, isDark ? tw`text-white` : tw`text-gray-900`]}>2,450</Text>
            <View style={tw`flex-row items-center mt-2`}>
              <TrendingUp size={12} color="#16A34A" />
              <Text style={tw`text-green-600 text-xs font-bold ml-1`}>+ 20.4%</Text>
            </View>
          </View>
        </View>

        {/* Revenue Overview Chart Section */}
        <View
          style={[
            tw`rounded-3xl p-5 mb-5`,
            isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
            {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            },
          ]}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={[tw`text-base font-bold`, isDark ? tw`text-white` : tw`text-gray-900`]}>Revenue Overview</Text>
            <TouchableOpacity style={[tw`flex-row items-center px-3 py-1.5 rounded-xl`, isDark ? tw`bg-zinc-950` : tw`bg-gray-150`]}>
              <Text style={[tw`font-bold text-xs`, isDark ? tw`text-zinc-300` : tw`text-gray-600`]}>This Week</Text>
              <ChevronDown size={12} color="#4B5563" style={tw`ml-1`} />
            </TouchableOpacity>
          </View>

          {/* Svg Line Chart */}
          <View style={tw`items-center`}>
            <Svg width="330" height="210">
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <Stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Grid Lines */}
              <Line x1="40" y1="30" x2="310" y2="30" stroke={isDark ? '#27272A' : '#F3F4F6'} strokeWidth="1" strokeDasharray="3,3" />
              <Line x1="40" y1="65" x2="310" y2="65" stroke={isDark ? '#27272A' : '#F3F4F6'} strokeWidth="1" strokeDasharray="3,3" />
              <Line x1="40" y1="100" x2="310" y2="100" stroke={isDark ? '#27272A' : '#F3F4F6'} strokeWidth="1" strokeDasharray="3,3" />
              <Line x1="40" y1="135" x2="310" y2="135" stroke={isDark ? '#27272A' : '#F3F4F6'} strokeWidth="1" strokeDasharray="3,3" />
              <Line x1="40" y1="170" x2="310" y2="170" stroke={isDark ? '#3F3F46' : '#E5E7EB'} strokeWidth="1" />

              {/* Y Axis Labels */}
              <SvgText x="30" y="34" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="end">24K</SvgText>
              <SvgText x="30" y="69" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="end">18K</SvgText>
              <SvgText x="30" y="104" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="end">12K</SvgText>
              <SvgText x="30" y="139" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="end">6K</SvgText>
              <SvgText x="30" y="174" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="end">0</SvgText>

              {/* Filled Area */}
              <Path
                d="M 40,150 Q 62,110 85,110 T 130,130 T 175,122 T 220,85 T 265,98 T 310,40 L 310,170 L 40,170 Z"
                fill="url(#chartGradient)"
              />

              {/* Curved Line */}
              <Path
                d="M 40,150 Q 62,110 85,110 T 130,130 T 175,122 T 220,85 T 265,98 T 310,40"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3.5"
              />

              {/* Vertical dotted guide for Tooltip */}
              <Line x1="175" y1="122" x2="175" y2="170" stroke="#4F46E5" strokeWidth="1" strokeDasharray="2,2" />

              {/* Data points (Mon - Sun) */}
              <Circle cx="40" cy="150" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />
              <Circle cx="85" cy="110" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />
              <Circle cx="130" cy="130" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />
              <Circle cx="175" cy="122" r="5" fill="#4F46E5" stroke={isDark ? '#18181b' : '#FFFFFF'} strokeWidth="2.5" />
              <Circle cx="220" cy="85" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />
              <Circle cx="265" cy="98" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />
              <Circle cx="310" cy="40" r="4.5" fill={isDark ? '#18181b' : '#FFFFFF'} stroke="#4F46E5" strokeWidth="2" />

              {/* Tooltip Box & Text over Wednesday/Thursday */}
              <Rect x="140" y="80" width="70" height="28" rx="8" fill="#1E1B4B" />
              <SvgText x="175" y="97" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">₹8,560</SvgText>

              {/* X Axis Labels */}
              <SvgText x="40" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Mon</SvgText>
              <SvgText x="85" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Tue</SvgText>
              <SvgText x="130" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Wed</SvgText>
              <SvgText x="175" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Thu</SvgText>
              <SvgText x="220" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Fri</SvgText>
              <SvgText x="265" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Sat</SvgText>
              <SvgText x="310" y="195" fill={isDark ? '#71717A' : '#9CA3AF'} fontSize="10" fontWeight="bold" textAnchor="middle">Sun</SvgText>
            </Svg>
          </View>
        </View>

        {/* Top Selling Items Section */}
        <View style={tw`flex-row justify-between items-center mb-3`}>
          <Text style={[tw`text-lg font-bold`, isDark ? tw`text-white` : tw`text-gray-900`]}>Top Selling Items</Text>
          <TouchableOpacity>
            <Text style={tw`text-indigo-600 font-bold text-xs uppercase`}>Edit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            tw`rounded-3xl p-4 mb-2 flex-row items-center`,
            isDark ? tw`bg-zinc-900 border border-zinc-800` : tw`bg-white`,
            {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.03,
              shadowRadius: 4,
              elevation: 1,
            },
          ]}>
          {/* Index Counter Badge */}
          <View style={[tw`w-6 h-6 rounded-full items-center justify-center mr-3`, isDark ? tw`bg-zinc-850` : tw`bg-gray-100`]}>
            <Text style={[tw`font-bold text-xs`, isDark ? tw`text-zinc-400` : tw`text-gray-500`]}>1</Text>
          </View>

          {/* Product Image */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80' }}
            style={tw`w-14 h-14 rounded-2xl mr-4 bg-gray-150`}
          />

          {/* Product Details */}
          <View style={tw`flex-1`}>
            <Text style={[tw`font-bold text-sm`, isDark ? tw`text-white` : tw`text-gray-900`]}>Veg Biryani</Text>
            <Text style={[tw`text-xs mt-0.5`, isDark ? tw`text-zinc-500` : tw`text-gray-400`]}>156 Orders</Text>
          </View>

          {/* Product Price */}
          <Text style={[tw`font-extrabold text-sm mr-2`, isDark ? tw`text-white` : tw`text-gray-900`]}>₹350</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
