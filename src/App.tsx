import React, { useState, useEffect } from 'react';
import { Bookmark, User } from './types';
import { BookmarkCard } from './components/BookmarkCard';
import { AddBookmarkForm } from './components/AddBookmarkForm';
import { AuthForm } from './components/AuthForm';
import { Bookmark as BookmarkIcon, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          avatar_url: session.user.user_metadata.avatar_url
        });
        fetchBookmarks(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          avatar_url: session.user.user_metadata.avatar_url
        });
        fetchBookmarks(session.user.id);
      } else {
        setUser(null);
        setBookmarks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBookmarks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      toast.error('Failed to fetch bookmarks');
    }
  };

  const handleAddBookmark = async (data: {
    type: Bookmark['type'];
    title: string;
    content: string;
    tags: string[];
  }) => {
    if (!user) return;

    try {
      let finalContent = data.content;

      // Handle file upload for photos
      if (data.type === 'photo' && data.content instanceof File) {
        const fileExt = data.content.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('bookmarks')
          .upload(filePath, data.content);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('bookmarks')
          .getPublicUrl(filePath);

        finalContent = publicUrl;
      }

      const newBookmark = {
        userId: user.id,
        type: data.type,
        title: data.title,
        content: finalContent,
        tags: data.tags,
        createdAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('bookmarks')
        .insert([newBookmark]);

      if (error) throw error;

      toast.success('Bookmark added successfully');
      fetchBookmarks(user.id);
    } catch (error) {
      toast.error('Failed to add bookmark');
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Bookmark deleted successfully');
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (error) {
      toast.error('Failed to delete bookmark');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <AuthForm />
        </div>
      ) : (
        <>
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookmarkIcon className="h-8 w-8 text-indigo-600" />
                  <h1 className="text-2xl font-semibold text-gray-900">BookmarkHub</h1>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <AddBookmarkForm onAdd={handleAddBookmark} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;