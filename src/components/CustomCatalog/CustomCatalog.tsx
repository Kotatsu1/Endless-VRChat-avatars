import "./styles.css"
import type { Avatar } from "@/types"
import { AvatarPanel } from "../AvatarPanel/AvatarPanel"
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event'


const CustomCatalog = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [filteredAvatars, setFilteredAvatars] = useState<Avatar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('added');


  useEffect(() => {
    const sortedAvatars = [...avatars].sort((a, b) => {
      if (sortBy === 'recent') {
        return (
          (b.lastUsed ? new Date(b.lastUsed).getTime() : 0) -
          (a.lastUsed ? new Date(a.lastUsed).getTime() : 0)
        );
      } else if (sortBy === 'added') {
        return b.id - a.id;
      } else {
        return 0;
      }
    });
  
    setFilteredAvatars(
      sortedAvatars.filter(avatar =>
        avatar.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [avatars, searchQuery, sortBy]);

  const getAllCustomAvatars = async () => {
    try {
      const items: Avatar[] = await invoke('get_all_avatars_cmd');
      const reversedItems = items.reverse();
      console.log(reversedItems)
      setAvatars(reversedItems)
    } catch (error) {
      console.error('Failed to get items:', error);
    }
  }
  const removeAvatar = async (avtr: string) => {
    try {
      await invoke('remove_avatar_cmd', { avtr });
      console.log('Item removed successfully');
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  const changeAvatar = async (avatarId: string) => {
    await invoke("update_avatar_last_used_cmd", { avtr: avatarId });
    const res = await invoke("change_avatar", { avatarId });
    await getAllCustomAvatars();
    console.log("avtr change", res)
  };


  useEffect(() => {
    getAllCustomAvatars();

    const setupListener = async () => {
      const unlisten = await listen('catalog_changed', (event) => {
        console.log('Avatar added event received:', event);
        getAllCustomAvatars();
      });

      return () => {
        unlisten();
      };
    };

    setupListener();
  }, []);


  return (
    <>
      <AvatarPanel />
      <h1 className="catalog-title">Custom Catalog</h1>
      <div className="input-container">
          <input
            className="search-query"
            type="text"
            placeholder="Avatar title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="sort-select" name="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="added">Date Added</option>
            <option value="recent">Recently Used</option>
          </select>
      </div>
      <div className="catalog-container">
        {filteredAvatars.map(avatar => (
          <div 
            key={avatar.id} 
            className="avatar-block"
          >
            <p>{avatar.title}</p>
            <img src={avatar.thumbnailUrl} />
            <div className="avatar-buttons">
              <button className="btn avatar-btn" onClick={() => changeAvatar(avatar.avtr)}>
                Select
              </button>
              <button className="btn avatar-btn" onClick={() => removeAvatar(avatar.avtr)}>
                Delete
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

export default CustomCatalog;
