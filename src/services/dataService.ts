import { 
  UserProfile, 
  Connection, 
  ConnectionRequest, 
  Message, 
  PhotoItem, 
  Community, 
  CommunityPost, 
  HobbyProject, 
  EmergencyContact,
  PrivacySettings,
  AccessibilitySettings
} from '../types';
import { 
  INITIAL_USER, 
  FAMILY_USER_SARAH,
  INITIAL_CONNECTIONS, 
  INITIAL_REQUESTS, 
  INITIAL_MESSAGES, 
  INITIAL_PHOTOS, 
  INITIAL_COMMUNITIES, 
  INITIAL_POSTS, 
  INITIAL_HOBBY, 
  INITIAL_EMERGENCY_CONTACTS 
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'connectcircle_current_user',
  CONNECTIONS: 'connectcircle_connections',
  REQUESTS: 'connectcircle_requests',
  MESSAGES: 'connectcircle_messages',
  PHOTOS: 'connectcircle_photos',
  COMMUNITIES: 'connectcircle_communities',
  POSTS: 'connectcircle_posts',
  HOBBY: 'connectcircle_hobby',
  EMERGENCY: 'connectcircle_emergency',
  PRIVACY: 'connectcircle_privacy',
  ACCESSIBILITY: 'connectcircle_accessibility',
  LANGUAGE: 'connectcircle_language',
  ONBOARDING_DONE: 'connectcircle_onboarding_done',
};

class DataService {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Current Active Profile Switcher ---
  getCurrentUser(): UserProfile {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_USER;
  }

  setCurrentUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  switchRole(role: 'senior' | 'family') {
    if (role === 'senior') {
      this.setCurrentUser(INITIAL_USER);
    } else {
      this.setCurrentUser(FAMILY_USER_SARAH);
    }
  }

  // --- Connections & Requests ---
  getConnections(): Connection[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_CONNECTIONS;
  }

  getConnectionRequests(): ConnectionRequest[] {
    const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_REQUESTS;
  }

  sendConnectionRequest(code: string, category: 'family' | 'friend' = 'friend'): { success: boolean; message: string } {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) {
      return { success: false, message: 'Please enter a valid connection code.' };
    }

    const currentReqs = this.getConnectionRequests();
    const newReq: ConnectionRequest = {
      id: `req-${Date.now()}`,
      requesterName: 'New Contact (' + cleanCode + ')',
      requesterNameUrdu: 'نیا رابطہ (' + cleanCode + ')',
      requesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      category: category,
      relationship: category === 'family' ? 'relative' : 'friend',
      relationshipUrdu: category === 'family' ? 'خاندانی عزیز' : 'دوست',
      connectionCode: cleanCode,
      createdAt: 'Just now',
      status: 'pending',
    };

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([newReq, ...currentReqs]));
    this.notify();
    return { success: true, message: 'Connection request sent successfully!' };
  }

  acceptConnectionRequest(requestId: string): void {
    const requests = this.getConnectionRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Add to connections
    const connections = this.getConnections();
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      userId: this.getCurrentUser().id,
      contactId: `usr-${Date.now()}`,
      name: req.requesterName,
      nameUrdu: req.requesterNameUrdu,
      avatarUrl: req.requesterAvatar,
      category: req.category,
      relationship: req.relationship,
      relationshipUrdu: req.relationshipUrdu,
      isEmergencyContact: false,
      isOnline: true,
      unreadCount: 0,
    };

    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify([...connections, newConn]));
    // Remove request
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests.filter(r => r.id !== requestId)));
    this.notify();
  }

  declineConnectionRequest(requestId: string): void {
    const requests = this.getConnectionRequests();
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests.filter(r => r.id !== requestId)));
    this.notify();
  }

  // --- Messages ---
  getMessages(): Message[] {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_MESSAGES;
  }

  sendMessage(receiverId: string, content: string, type: 'text' | 'voice' | 'photo' = 'text', mediaUrl?: string): Message {
    const currentUser = this.getCurrentUser();
    const messages = this.getMessages();

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: receiverId,
      senderName: currentUser.fullName,
      content: content,
      messageType: type,
      mediaUrl: mediaUrl,
      isRead: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, newMsg];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    this.notify();

    // If Supabase is connected, optionally sync
    if (isSupabaseConfigured && supabase) {
      supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: receiverId,
        content: content,
        message_type: type,
        media_url: mediaUrl,
      }).then();
    }

    return newMsg;
  }

  addMessageReaction(messageId: string, emoji: string) {
    const messages = this.getMessages().map(msg => 
      msg.id === messageId ? { ...msg, reaction: emoji } : msg
    );
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    this.notify();
  }

  // --- Photos ---
  getPhotos(): PhotoItem[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_PHOTOS;
  }

  uploadPhoto(photoUrl: string, caption: string, audience: 'family' | 'friends' | 'all' = 'family'): PhotoItem {
    const currentUser = this.getCurrentUser();
    const photos = this.getPhotos();

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      userId: currentUser.id,
      authorName: currentUser.fullName + ' (You)',
      authorAvatar: currentUser.avatarUrl,
      photoUrl: photoUrl,
      caption: caption,
      audience: audience,
      likesCount: 0,
      isLikedByMe: false,
      createdAt: 'Just now',
    };

    const updated = [newPhoto, ...photos];
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(updated));
    this.notify();
    return newPhoto;
  }

  toggleLikePhoto(photoId: string) {
    const photos = this.getPhotos().map(p => {
      if (p.id === photoId) {
        const isLiked = !p.isLikedByMe;
        return {
          ...p,
          isLikedByMe: isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    this.notify();
  }

  // --- Communities ---
  getCommunities(): Community[] {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_COMMUNITIES;
  }

  toggleJoinCommunity(communityId: string) {
    const communities = this.getCommunities().map(c => {
      if (c.id === communityId) {
        const joined = !c.isJoined;
        return {
          ...c,
          isJoined: joined,
          memberCount: joined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
        };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
    this.notify();
  }

  getPosts(communityId?: string): CommunityPost[] {
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    let posts: CommunityPost[] = INITIAL_POSTS;
    if (stored) {
      try { posts = JSON.parse(stored); } catch (e) {}
    }
    return communityId ? posts.filter(p => p.communityId === communityId) : posts;
  }

  createPost(communityId: string, content: string, imageUrl?: string): CommunityPost {
    const currentUser = this.getCurrentUser();
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    let posts: CommunityPost[] = stored ? JSON.parse(stored) : INITIAL_POSTS;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId,
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      content,
      imageUrl,
      likesCount: 0,
      isLikedByMe: false,
      commentsCount: 0,
      comments: [],
      createdAt: 'Just now',
    };

    posts = [newPost, ...posts];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
    return newPost;
  }

  addComment(postId: string, content: string) {
    const currentUser = this.getCurrentUser();
    const stored = localStorage.getItem(STORAGE_KEYS.POSTS);
    let posts: CommunityPost[] = stored ? JSON.parse(stored) : INITIAL_POSTS;

    posts = posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        const newC = {
          id: `c-${Date.now()}`,
          postId,
          authorId: currentUser.id,
          authorName: currentUser.fullName,
          authorAvatar: currentUser.avatarUrl,
          content,
          createdAt: 'Just now',
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...comments, newC],
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify();
  }

  // --- Hobby Streaks (e.g. Knitting "My Blue Scarf") ---
  getHobbyProject(): HobbyProject {
    const stored = localStorage.getItem(STORAGE_KEYS.HOBBY);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_HOBBY;
  }

  logHobbyProgressToday(note: string, photoUrl?: string): HobbyProject {
    const hobby = this.getHobbyProject();
    const today = new Date().toISOString().split('T')[0];

    const updated: HobbyProject = {
      ...hobby,
      currentStreak: hobby.isLoggedToday ? hobby.currentStreak : hobby.currentStreak + 1,
      longestStreak: Math.max(hobby.longestStreak, hobby.currentStreak + 1),
      lastLoggedDate: today,
      isLoggedToday: true,
      photoUrl: photoUrl || hobby.photoUrl,
      progressNotes: [
        { date: 'Today', note: note || 'Worked gently on project rows and details.' },
        ...hobby.progressNotes
      ]
    };

    localStorage.setItem(STORAGE_KEYS.HOBBY, JSON.stringify(updated));
    this.notify();
    return updated;
  }

  // --- Emergency Contacts ---
  getEmergencyContacts(): EmergencyContact[] {
    const stored = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return INITIAL_EMERGENCY_CONTACTS;
  }

  saveEmergencyContact(contact: EmergencyContact) {
    const contacts = this.getEmergencyContacts();
    const existingIdx = contacts.findIndex(c => c.id === contact.id);
    let updated: EmergencyContact[];
    if (existingIdx >= 0) {
      updated = contacts.map(c => c.id === contact.id ? contact : c);
    } else {
      updated = [...contacts, contact];
    }
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(updated));
    this.notify();
  }

  // --- Privacy Settings ---
  getPrivacySettings(): PrivacySettings {
    const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) {}
    }
    return {
      whoCanContactMe: 'approved',
      whoCanViewPhotos: 'family',
    };
  }

  savePrivacySettings(settings: PrivacySettings) {
    localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(settings));
    this.notify();
  }

  // --- Reset to clean demo state ---
  resetAllDemoData() {
    localStorage.removeItem(STORAGE_KEYS.CONNECTIONS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem(STORAGE_KEYS.COMMUNITIES);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.HOBBY);
    this.setCurrentUser(INITIAL_USER);
    this.notify();
  }
}

export const dataService = new DataService();
