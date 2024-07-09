import "./styles.css"
import type { SearchAvatar } from "@/types"
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from 'react';
import React from "react";
import unavailableAvatar  from "@/assets/unavailable-avatar.png"


const SearchAvatars = () => {
  const [avatars, setAvatars] = useState<SearchAvatar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchByTitle = async (page: number, event: React.FormEvent | null = null) => {
    if (!searchQuery) return
    setLoading(true);
    setAvatars([]);
    if (event) {
      event.preventDefault()
    }

    setPage(page);
    const avatars: string = await invoke("search_avatars", { searchQuery });

    const splittedAvatars = avatars.split("\n");

    const pageSize = 30
    const totalPages = Math.ceil(splittedAvatars.length / pageSize);
    setTotalPages(totalPages);
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAvatars = splittedAvatars.slice(startIndex, endIndex);
  
    const convertedToObjects = await Promise.all(paginatedAvatars.map(async avatar => {
      const [avtr, , title] = avatar.split('|');
      const rawAvatarInfo: string = await invoke('get_avatar_info', { avtr });
      const parsedAvatarInfo = JSON.parse(rawAvatarInfo);
      const thumbnailUrl = parsedAvatarInfo.thumbnailImageUrl;
      
      return { avtr, title, thumbnailUrl };
    }));
    setLoading(false);
    setAvatars(convertedToObjects);
  };

  const changeAvatar = async (avatarId: string) => {
    const res = await invoke("change_avatar", { avatarId });
    console.log("avtr change", res)
  };

  const addToCustomAvatars = async (avtr: string, title: string, thumbnailUrl: string) => {
    const existsingAvatar = await invoke('get_existing_avatar_cmd', { avtr })

    if (existsingAvatar) {
      console.log('Avatar already exists');
      return;
    }
    const res = await invoke("add_avatar_cmd", { avtr, title, thumbnailUrl });
    console.log("avtr to custom", res)
  };

  useEffect(() => {
    searchByTitle(page);
  }, [page]);

  return (
    <>
      <h1 className="catalog-title">Search Avatars</h1>
      <div className="input-container">
        <form onSubmit={(e) => searchByTitle(1, e)}>
          <input
            className="search-query"
            type="text"
            placeholder="Avatar title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn" type="submit">
            Search
          </button>
        </form>
          
        </div>
      <div className="catalog-container">
        {loading && <div className="loader-spinner" />}
        {avatars.map(avatar => (
          <div 
            key={avatar.avtr} 
            className="avatar-block"
          >
            <p className="avatar-title">{avatar.title}</p>
            <img 
              src={avatar.thumbnailUrl ? avatar.thumbnailUrl : unavailableAvatar} 
              alt="Avatar" 
              onError={(e) => {
                e.currentTarget.src = unavailableAvatar;
                e.currentTarget.onerror = null;
              }}
            />
            <div className="avatar-buttons">
              <button className="btn avatar-btn" onClick={() => changeAvatar(avatar.avtr)}>
                Select
              </button>
              <button className="btn avatar-btn" onClick={() => addToCustomAvatars(avatar.avtr, avatar.title, avatar.thumbnailUrl)}>
                To Custom
              </button>
            </div>
          </div>
        ))}
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
        <div className="dummy avatar-block"></div>
      </div>
      {avatars[0]?.avtr &&
        <div className="pagination">
          <button className="btn" onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <p className="page">Page {page} of {totalPages}</p>
          <button 
            className="btn" 
            disabled={page === totalPages} 
            style={page === totalPages ? { backgroundColor: 'gray' } : {}} 
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      }

    </>
  )
}

export default SearchAvatars;
