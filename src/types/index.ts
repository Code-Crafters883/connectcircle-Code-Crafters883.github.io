// Type definitions for ConnectCircle application

export type Language = 'en' | 'ur';

export type UserRole = 'senior' | 'family' | 'friend';

export type FontSizePreference = 'small' | 'medium' | 'large' | 'xl';

export type ContrastMode = 'standard' | 'high-contrast-dark' | 'high-contrast-yellow';

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  age?: number;
  bio?: string;
  bioUrdu?: string;
  interests: string[];
  connectionCode: string;
  isOnline?: boolean;
}

export type RelationshipType = 
  | 'daughter' 
  | 'son' 
  | 'granddaughter' 
  | 'grandson' 
  | 'spouse' 
  | 'sibling' 
  | 'friend' 
  | 'neighbor' 
  | 'relative'
  | 'caregiver';

export interface Connection {
  id: string;
  userId: string;
  contactId: string;
  name: string;
  nameUrdu: string;
  avatarUrl: string;
  category: 'family' | 'friend';
  relationship: RelationshipType;
  relationshipUrdu: string;
  phone?: string;
  isEmergencyContact: boolean;
  isOnline: boolean;
  unreadCount?: number;
}

export interface ConnectionRequest {
  id: string;
  requesterName: string;
  requesterNameUrdu: string;
  requesterAvatar: string;
  category: 'family' | 'friend';
  relationship: RelationshipType;
  relationshipUrdu: string;
  connectionCode: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  messageType: 'text' | 'voice' | 'photo';
  mediaUrl?: string;
  voiceDurationSeconds?: number;
  reaction?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PhotoItem {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  photoUrl: string;
  caption: string;
  captionUrdu?: string;
  audience: 'family' | 'friends' | 'all';
  likesCount: number;
  isLikedByMe?: boolean;
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  icon: string;
  imageUrl?: string;
  category: string;
  memberCount: number;
  isJoined?: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  isLikedByMe?: boolean;
  commentsCount: number;
  comments?: CommunityComment[];
  createdAt: string;
}

export type HobbyCategory = 'knitting' | 'gardening' | 'reading' | 'walking' | 'drawing' | 'chess' | 'music';

export interface HobbyProject {
  id: string;
  userId: string;
  title: string;
  titleUrdu: string;
  category: HobbyCategory;
  categoryUrdu: string;
  description: string;
  descriptionUrdu: string;
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string; // YYYY-MM-DD
  isLoggedToday: boolean;
  photoUrl?: string;
  progressNotes: { date: string; note: string; photoUrl?: string }[];
}

export interface DailySuggestion {
  id: string;
  icon: string;
  title: string;
  titleUrdu: string;
  actionText: string;
  actionTextUrdu: string;
  actionScreen: string; // e.g. 'activities', 'messages', 'photos'
  actionPayload?: any;
}

export interface EmergencyContact {
  id: string;
  name: string;
  nameUrdu: string;
  relationship: string;
  relationshipUrdu: string;
  phone: string;
  isPrimary: boolean;
}

export interface CallSession {
  active: boolean;
  contact?: Connection;
  isIncoming: boolean;
  isVideo: boolean;
  isMuted: boolean;
  isSpeaker: boolean;
  durationSeconds: number;
  status: 'idle' | 'calling' | 'connected' | 'ended';
}

export interface AccessibilitySettings {
  fontSize: FontSizePreference;
  contrastMode: ContrastMode;
  reducedMotion: boolean;
  voiceAssistance: boolean;
}

export interface PrivacySettings {
  whoCanContactMe: 'family' | 'friends' | 'approved';
  whoCanViewPhotos: 'family' | 'friends' | 'all';
}
