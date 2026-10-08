import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ShoppingBag,
  CheckSquare,
  Square,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { loginVendor, setToken, setVendorUser } from '../services/apiService';

// Google "G" icon component
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

interface LoginScreenProps {
  onLogin: (user: any) => void;
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToSignup }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const loginEmail = email.trim() || 'karthikeyan@vendor.com';
    const loginPassword = password || 'password123';
    
    setLoading(true);
    try {
      const res = await loginVendor(loginEmail, loginPassword);
      setLoading(false);
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        Alert.alert('Login Failed', res.message || 'Unable to connect to MongoDB server.');
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Connection Error', err.message || 'Failed to authenticate with MongoDB server.');
    }
  };

  return (
    <View style={tw`flex-1`}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow`}
          bounces={false}
          showsVerticalScrollIndicator={false}>

          {/* Dark Navy Header */}
          <View
            style={[
              tw`px-6 items-center`,
              {
                paddingTop: insets.top + 24,
                paddingBottom: 50,
                backgroundColor: '#0F172A',
              },
            ]}>
            {/* Decorative dots */}
            <View style={tw`absolute top-12 left-4 opacity-20`}>
              {[0, 1, 2, 3].map(row => (
                <View key={row} style={tw`flex-row mb-1.5`}>
                  {[0, 1, 2].map(col => (
                    <View key={col} style={tw`w-1.5 h-1.5 rounded-full bg-white mr-2`} />
                  ))}
                </View>
              ))}
            </View>

            {/* Decorative diamonds */}
            <View style={[tw`absolute top-20 right-16 w-2.5 h-2.5 opacity-25`, { transform: [{ rotate: '45deg' }], backgroundColor: 'rgba(255,255,255,0.5)' }]} />
            <View style={[tw`absolute bottom-16 right-8 w-2 h-2 opacity-20`, { transform: [{ rotate: '45deg' }], backgroundColor: 'rgba(255,255,255,0.5)' }]} />

            {/* Logo */}
            <View style={tw`items-center justify-center mb-1`}>
              <Image
                source={require('../assets/logo.png')}
                style={tw`w-24 h-24 rounded-full border-2 border-amber-500/40`}
                resizeMode="cover"
              />
            </View>

            <Text style={tw`text-white text-2xl font-bold mt-3 text-center`}>
              Connect <Text style={{ color: '#F59E0B' }}>App</Text>
            </Text>
            <Text style={tw`text-gray-400 text-xs font-medium mt-1`}>
              Vendor Dashboard
            </Text>

            <Text style={tw`text-gray-300 text-center text-sm mt-4 px-4 leading-5`}>
              Manage your business, orders, and{'\n'}customers all in one place
            </Text>
          </View>

          {/* White Form Card */}
          <View
            style={[
              tw`bg-white flex-1 px-6 pt-8 pb-6`,
              {
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                marginTop: -25,
              },
            ]}>
            <Text style={tw`text-gray-900 text-2xl font-bold text-center`}>
              Welcome Back!
            </Text>
            <Text style={tw`text-gray-400 text-sm text-center mt-1.5 mb-7`}>
              Sign in to your vendor account
            </Text>

            {/* Email Input */}
            <View style={tw`flex-row items-center bg-gray-50 rounded-xl px-4 py-1 mb-4 border border-gray-100`}>
              <Mail size={18} color="#9CA3AF" />
              <TextInput
                style={tw`flex-1 ml-3 text-sm font-medium text-gray-800 py-3`}
                placeholder="Email or Mobile Number"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={tw`flex-row items-center bg-gray-50 rounded-xl px-4 py-1 mb-2 border border-gray-100`}>
              <Lock size={18} color="#9CA3AF" />
              <TextInput
                style={tw`flex-1 ml-3 text-sm font-medium text-gray-800 py-3`}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={18} color="#9CA3AF" />
                ) : (
                  <EyeOff size={18} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={tw`self-end mb-5`}>
              <Text style={tw`text-indigo-600 text-xs font-bold`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Remember Me */}
            <TouchableOpacity
              style={tw`flex-row items-center mb-6`}
              onPress={() => setRememberMe(!rememberMe)}>
              {rememberMe ? (
                <CheckSquare size={20} color="#4F46E5" />
              ) : (
                <Square size={20} color="#9CA3AF" />
              )}
              <Text style={tw`text-gray-600 text-sm font-medium ml-2`}>
                Remember me
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
              style={[
                tw`py-4 rounded-2xl items-center justify-center mb-5`,
                {
                  backgroundColor: loading ? '#D1D5DB' : '#F59E0B',
                  shadowColor: '#F59E0B',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                },
              ]}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={tw`text-white font-bold text-base`}>Login</Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={tw`flex-row items-center mb-5`}>
              <View style={tw`flex-1 h-px bg-gray-200`} />
              <Text style={tw`text-gray-400 text-xs font-medium mx-4`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-200`} />
            </View>

            {/* Google Login */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.7}
              style={tw`flex-row items-center justify-center py-3.5 rounded-2xl mb-3 border border-gray-200 bg-white`}>
              <GoogleIcon size={20} />
              <Text style={tw`text-gray-700 font-semibold text-sm ml-3`}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Mobile OTP Login */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.7}
              style={tw`flex-row items-center justify-center py-3.5 rounded-2xl mb-6 border border-gray-200 bg-white`}>
              <View style={[tw`w-5 h-5 rounded-full items-center justify-center`, { backgroundColor: '#4F46E5' }]}>
                <Phone size={12} color="#FFFFFF" />
              </View>
              <Text style={tw`text-gray-700 font-semibold text-sm ml-3`}>
                Continue with Mobile OTP
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={tw`flex-row justify-center`}>
              <Text style={tw`text-gray-500 text-sm`}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={onNavigateToSignup}>
                <Text style={tw`text-indigo-600 text-sm font-bold`}>
                  Register Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
