import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { dataService } from '../services/dataService';
import { soundService } from '../services/soundService';
import { Community, CommunityPost } from '../types';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Heart, 
  X, 
  Check, 
  Share2, 
  Send, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommunitiesScreen: React.FC = () => {
  const { t, language, direction } = useLanguage();
  const { currentUser } = useAuth();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const comms = dataService.getCommunities();
      setCommunities(comms);
      if (selectedCommunity) {
        setPosts(dataService.getPosts(selectedCommunity.id));
      }
    };
    update();
    return dataService.subscribe(update);
  }, [selectedCommunity]);

  const handleSelectCommunity = (c: Community) => {
    soundService.playTap();
    setSelectedCommunity(c);
    setPosts(dataService.getPosts(c.id));
  };

  const handleToggleJoin = (e: React.MouseEvent, c: Community) => {
    e.stopPropagation();
    soundService.playSuccess();
    dataService.toggleJoinCommunity(c.id);
    if (!c.isJoined) {
      confetti({ particleCount: 30, spread: 60 });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !selectedCommunity) return;

    soundService.playSuccess();
    dataService.createPost(selectedCommunity.id, postContent.trim());
    setPostContent('');
    setShowNewPostModal(false);
    confetti({ particleCount: 20 });
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    soundService.playTap();
    dataService.addComment(postId, commentInput.trim());
    setCommentInput('');
    setActiveCommentPostId(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24">
      
      {/* 1. Header or Back to Directory */}
      {selectedCommunity ? (
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
          <button
            onClick={() => {
              soundService.playTap();
              setSelectedCommunity(null);
            }}
            className="min-h-touch px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center gap-2 text-slate-800 font-extrabold text-lg active:scale-95"
          >
            {direction === 'rtl' ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
            <span>{t.back}</span>
          </button>

          <button
            onClick={() => {
              soundService.playTap();
              setShowNewPostModal(true);
            }}
            className="min-h-touch px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-lg rounded-2xl flex items-center gap-2 shadow-md active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span>{t.communitiesScreen.newPost}</span>
          </button>
        </div>
      ) : (
        <div className="pb-2 border-b-2 border-slate-200">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            {t.communitiesScreen.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            {t.communitiesScreen.subtitle}
          </p>
        </div>
      )}

      {/* 2. Detail View of a Selected Community */}
      {selectedCommunity ? (
        <div className="space-y-6">
          {/* Community Hero Banner */}
          <div className="bg-white rounded-3xl p-6 border-3 border-emerald-600 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="text-5xl">{selectedCommunity.icon}</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {language === 'ur' ? selectedCommunity.nameUrdu : selectedCommunity.name}
                </h2>
                <p className="text-slate-600 text-base sm:text-lg mt-1">
                  {language === 'ur' ? selectedCommunity.descriptionUrdu : selectedCommunity.description}
                </p>
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mt-2">
                  <Users className="w-4 h-4" />
                  <span>{selectedCommunity.memberCount} {t.communitiesScreen.members}</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => handleToggleJoin(e, selectedCommunity)}
              className={`min-h-touch px-6 py-3 rounded-2xl font-extrabold text-lg shadow-md transition-all active:scale-95 shrink-0 ${
                selectedCommunity.isJoined
                  ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {selectedCommunity.isJoined ? t.communitiesScreen.joined : t.communitiesScreen.join}
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900">
              {language === 'ur' ? 'کمیونٹی کی گفتگو' : 'Community Conversations'}
            </h3>

            {posts.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border-2 border-slate-200">
                <p className="text-xl text-slate-600 font-bold mb-3">
                  {language === 'ur' ? 'ابھی تک کوئی بات شیئر نہیں کی گئی۔' : 'No posts in this community yet.'}
                </p>
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="px-6 py-3 bg-emerald-700 text-white font-extrabold text-lg rounded-2xl"
                >
                  {t.communitiesScreen.newPost}
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 shadow-sm space-y-4"
                >
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <h4 className="text-xl font-extrabold text-slate-900">
                        {post.authorName}
                      </h4>
                      <span className="text-xs text-slate-400 font-semibold">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xl text-slate-800 leading-relaxed font-medium">
                    {post.content}
                  </p>

                  {/* Attached Image if any */}
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post visual"
                      className="w-full max-h-72 rounded-2xl object-cover border"
                    />
                  )}

                  {/* Reactions & Comment Bar */}
                  <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => soundService.playSuccess()}
                      className="min-h-touch px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-base flex items-center gap-2 border border-rose-200 active:scale-95"
                    >
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="min-h-touch px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center gap-2 border border-slate-300 active:scale-95"
                    >
                      <MessageSquare className="w-5 h-5 text-slate-600" />
                      <span>{post.commentsCount} {t.communitiesScreen.comments}</span>
                    </button>
                  </div>

                  {/* Comments section if open */}
                  {activeCommentPostId === post.id && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-fade-in">
                      {post.comments?.map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-extrabold text-slate-900 text-sm block">
                            {c.authorName}
                          </span>
                          <p className="text-base text-slate-800 font-medium">{c.content}</p>
                        </div>
                      ))}

                      {/* Add comment input */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder={t.communitiesScreen.writeComment}
                          className="flex-1 min-h-touch px-4 py-2 rounded-xl border border-slate-300 text-base focus:border-emerald-600 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="min-h-touch px-5 bg-emerald-700 text-white font-bold rounded-xl active:scale-95"
                        >
                          {t.communitiesScreen.reply}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* 3. Community Discovery Directory */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communities.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectCommunity(c)}
              className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-slate-200 hover:border-emerald-500 shadow-md flex flex-col justify-between cursor-pointer transition-all active:scale-98 group"
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl shrink-0 p-2 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                  {c.icon}
                </span>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {language === 'ur' ? c.nameUrdu : c.name}
                  </h3>
                  <p className="text-base text-slate-600 font-medium mt-1 leading-snug">
                    {language === 'ur' ? c.descriptionUrdu : c.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm mt-3">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>{c.memberCount} {t.communitiesScreen.members}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <span className="text-emerald-800 font-bold text-base group-hover:underline flex items-center gap-1">
                  <span>{language === 'ur' ? 'گفتگو دیکھیں' : 'View Group'}</span>
                  {direction === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </span>

                <button
                  onClick={(e) => handleToggleJoin(e, c)}
                  className={`min-h-touch px-5 py-2.5 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${
                    c.isJoined
                      ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md'
                  }`}
                >
                  {c.isJoined ? t.communitiesScreen.joined : t.communitiesScreen.join}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. New Post Modal */}
      {showNewPostModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-2xl font-black text-slate-900">
                {t.communitiesScreen.newPost}
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={t.communitiesScreen.postPlaceholder}
                className="w-full p-4 rounded-2xl border-2 border-slate-300 text-xl text-slate-900 focus:border-emerald-600 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full min-h-touch py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl rounded-2xl shadow-lg active:scale-95"
              >
                {t.communitiesScreen.postButton}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
