import "./styles.css"
import type { SearchAvatar } from "@/types"
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from 'react';


const SearchAvatars = () => {
  const [avatars, setAvatars] = useState<SearchAvatar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const searchByTitle = async (page: number) => {
    setPage(page);
    const avatars: string = await invoke("search_avatars", { searchQuery });
    const splittedAvatars = avatars.split("\n");

    const pageSize = 30
    
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
    
    setAvatars(convertedToObjects);
  };

  const changeAvatar = async (avatarId: string) => {
    const res = await invoke("change_avatar", { avatarId });
    console.log("avtr change", res)
  };

  const addToCustomAvatars = async (avtr: string, title: string, thumbnailUrl: string) => {
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
          <input
            className="search-query"
            type="text"
            placeholder="Avatar title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn" onClick={() => searchByTitle(1)}>
            Search
          </button>
          <div className="pagination">
            <button className="btn" onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <p className="page">Page {page}</p>
            <button className="btn" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      <div className="catalog-container">
        {avatars.map(avatar => (
          <div 
            key={avatar.avtr} 
            className="avatar-block"
          >
            <p>{avatar.title}</p>
            <img src={avatar.thumbnailUrl} />
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
    </>
  )
}

export default SearchAvatars;
