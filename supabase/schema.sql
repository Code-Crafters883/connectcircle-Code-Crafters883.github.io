-- ====================================================================
-- ConnectCircle: Database Schema & Row Level Security (RLS)
-- From Isolation to Interaction: Senior-Friendly Mobile-First App
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('senior', 'family', 'friend')),
    age INTEGER,
    bio TEXT,
    interests TEXT[] DEFAULT '{}',
    connection_code TEXT UNIQUE,
    language_pref TEXT DEFAULT 'en' CHECK (language_pref IN ('en', 'ur')),
    font_size_pref TEXT DEFAULT 'large' CHECK (font_size_pref IN ('small', 'medium', 'large', 'xl')),
    high_contrast BOOLEAN DEFAULT false,
    reduced_motion BOOLEAN DEFAULT false,
    voice_assistance BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Connections Table
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('family', 'friend')),
    relationship_type TEXT NOT NULL, -- 'daughter', 'son', 'granddaughter', 'friend', 'neighbor', etc.
    is_emergency_contact BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);

-- 3. Connection Requests (via short 6-char codes)
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('family', 'friend')),
    relationship_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'photo')),
    media_url TEXT,
    voice_duration_seconds INTEGER,
    reaction TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Shared Photos Gallery
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    audience TEXT NOT NULL DEFAULT 'family' CHECK (audience IN ('family', 'friends', 'all')),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Communities Table
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_ur TEXT NOT NULL,
    description TEXT NOT NULL,
    description_ur TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    member_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Community Memberships
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(community_id, user_id)
);

-- 8. Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Community Comments
CREATE TABLE IF NOT EXISTS public.community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Hobby Projects & Streaks
CREATE TABLE IF NOT EXISTS public.hobby_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_ur TEXT,
    category TEXT NOT NULL CHECK (category IN ('knitting', 'gardening', 'reading', 'walking', 'drawing', 'chess', 'music')),
    description TEXT,
    current_streak INTEGER DEFAULT 1,
    longest_streak INTEGER DEFAULT 1,
    last_logged_date DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Hobby Daily Progress
CREATE TABLE IF NOT EXISTS public.hobby_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.hobby_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT,
    photo_url TEXT,
    logged_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Emergency Contacts
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobby_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobby_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
CREATE POLICY "Profiles readable by authenticated users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Connections: User can see own connections
CREATE POLICY "Users view own connections" ON public.connections FOR SELECT USING (auth.uid() = user_id OR auth.uid() = contact_id);
CREATE POLICY "Users insert connections" ON public.connections FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages: Sender & receiver only
CREATE POLICY "Users see their messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users update received messages (mark read)" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Photos: Viewer must be connected or photo audience permits
CREATE POLICY "Photos viewable by audience" ON public.photos FOR SELECT USING (
    audience = 'all' 
    OR auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM public.connections WHERE user_id = photos.user_id AND contact_id = auth.uid())
);
CREATE POLICY "Users insert photos" ON public.photos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Communities: Anyone can read
CREATE POLICY "Communities are readable by all" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Memberships viewable by all" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- Community Posts & Comments
CREATE POLICY "Posts viewable by all" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Comments viewable by all" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Hobby Projects & Progress
CREATE POLICY "Users view own hobbies" ON public.hobby_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own hobbies" ON public.hobby_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own hobbies" ON public.hobby_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users view hobby progress" ON public.hobby_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert hobby progress" ON public.hobby_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emergency Contacts
CREATE POLICY "Users view own emergency contacts" ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own emergency contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- ====================================================================
-- SEED DEMONSTRATION DATA
-- ====================================================================

-- Communities Seed
INSERT INTO public.communities (id, name, name_ur, description, description_ur, icon, category, member_count) VALUES
('11111111-1111-1111-1111-111111111101', 'Gardening & Nature', 'باغبانی اور فطرت', 'Share garden tips, flower pictures, and seasonal care.', 'باغ کی تجاویز، پھولوں کی تصاویر اور پودوں کی دیکھ بھال شیئر کریں۔', '🌱', 'gardening', 142),
('11111111-1111-1111-1111-111111111102', 'Knitting & Crafts', 'بنائی اور دستکاری', 'Knitting patterns, crochet, embroidery and warm creations.', 'بنائی کے نمونے، قریشیا اور خوبصورت ہاتھ کا کام۔', '🧶', 'crafts', 98),
('11111111-1111-1111-1111-111111111103', 'Chess & Mind Games', 'شطرنج اور دماغی کھیل', 'Friendly chess matches, puzzles, and gentle brain exercises.', 'دوستانہ شطرنج کے کھیل اور دلچسپ دماغی پہیلیاں۔', '♟️', 'games', 76),
('11111111-1111-1111-1111-111111111104', 'Book Club & Stories', 'کتابوں کا کلب اور کہانیاں', 'Discussing heartwarming classics, poetry, and shared memories.', 'دلچسپ کتابوں، شاعری اور پرانی یادوں پر گفتگو۔', '📚', 'books', 115),
('11111111-1111-1111-1111-111111111105', 'Home Cooking', 'گھریلو کھانا پکانا', 'Traditional family recipes, healthy cooking, and baking tips.', 'روایتی خاندانی ترکیبیں اور صحت بخش کھانا۔', '🍳', 'cooking', 160),
('11111111-1111-1111-1111-111111111106', 'Golden Oldies Music', 'سنہری موسیقی', 'Celebrating classic songs, folk music, and nostalgic melodies.', 'پرانے سنہری نغمے اور کلاسیکی موسیقی کی یادیں۔', '🎵', 'music', 134),
('11111111-1111-1111-1111-111111111107', 'Poetry & Ghazals', 'شاعری اور غزلیں', 'Sharing classical Urdu and English verses and couplets.', 'اردو اور انگریزی کے خوبصورت اشعار اور غزلیں۔', '✍️', 'poetry', 89),
('11111111-1111-1111-1111-111111111108', 'Walking & Fresh Air', 'چہل قدمی اور تازہ ہوا', 'Gentle morning walks, park pictures, and fresh air habits.', 'صبح کی ہلکی سیر، پارک کی تصاویر اور صحت مند چہل قدمی۔', '🚶', 'walking', 92)
ON CONFLICT (id) DO NOTHING;
