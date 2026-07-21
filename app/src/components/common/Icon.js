import React from 'react';
import {
  MapPin,
  User,
  Briefcase,
  Bell,
  Phone,
  Settings,
  Truck,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Clock,
  Wrench,
  Fuel,
  Car,
  Sun,
  Moon,
  Globe,
  Navigation
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export const Icon = ({ name, size = 22, color }) => {
  const { theme } = useTheme();
  const activeColor = color || theme.primary;

  const iconMap = {
    map: <MapPin size={size} color={activeColor} />,
    user: <User size={size} color={activeColor} />,
    briefcase: <Briefcase size={size} color={activeColor} />,
    bell: <Bell size={size} color={activeColor} />,
    phone: <Phone size={size} color={activeColor} />,
    settings: <Settings size={size} color={activeColor} />,
    truck: <Truck size={size} color={activeColor} />,
    chevronRight: <ChevronRight size={size} color={activeColor} />,
    back: <ArrowLeft size={size} color={activeColor} />,
    whatsapp: <MessageSquare size={size} color={activeColor} />,
    checkmark: <CheckCircle2 size={size} color={activeColor} />,
    time: <Clock size={size} color={activeColor} />,
    wrench: <Wrench size={size} color={activeColor} />,
    fuel: <Fuel size={size} color={activeColor} />,
    car: <Car size={size} color={activeColor} />,
    sun: <Sun size={size} color={activeColor} />,
    moon: <Moon size={size} color={activeColor} />,
    globe: <Globe size={size} color={activeColor} />,
    navigation: <Navigation size={size} color={activeColor} />,
  };

  return iconMap[name] || <MapPin size={size} color={activeColor} />;
};
