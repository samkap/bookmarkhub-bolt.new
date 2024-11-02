import React from 'react';
import { Bookmark } from '../types';
import { Image, Link, FileText, X, Tag } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const iconMap = {
    photo: Image,
    link: Link,
    text: FileText,
  };
  
  const Icon = iconMap[bookmark.type];

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 relative group">
      <button
        onClick={() => onDelete(bookmark.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{bookmark.title}</h3>
          
          {bookmark.type === 'photo' && (
            <img
              src={bookmark.content}
              alt={bookmark.title}
              className="mt-2 rounded-lg w-full h-48 object-cover"
            />
          )}
          
          {bookmark.type === 'link' && (
            <a
              href={bookmark.content}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-sm text-blue-600 hover:underline truncate block"
            >
              {bookmark.content}
            </a>
          )}
          
          {bookmark.type === 'text' && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-3">{bookmark.content}</p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}