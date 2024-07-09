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


  useEffect(() => {
    setFilteredAvatars(avatars.filter(avatar =>
      avatar.title.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [avatars, searchQuery]);

  const getAllCustomAvatars = async () => {
    try {
      const items: Avatar[] = await invoke('get_all_avatars_cmd');
      setAvatars(items)
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
    const res = await invoke("change_avatar", { avatarId });
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
