import "./styles.css"
import type { SiteAvatar } from "@/types"
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from 'react';


const IngameCatalog = () => {
  const [avatars, setAvatars] = useState<SiteAvatar[]>([]);

  const getFavoriteAvatars = async () => {
    const avatars: string = await invoke("get_favorite_avatars")
    const parsedAvatars: SiteAvatar[] = JSON.parse(avatars)
    setAvatars(parsedAvatars)
  }

  const changeAvatar = async (avatarId: string) => {
    const res = await invoke("change_avatar", { avatarId });
    console.log("avtr change", res)
  };

  const addToCustomAvatars = async (avtr: string, title: string, thumbnailUrl: string) => {
    const res = await invoke("add_avatar_cmd", { avtr, title, thumbnailUrl });
    console.log("avtr to custom", res)
  };

  useEffect(() => {
    getFavoriteAvatars();
  }, [])

  return (
    <>
      <h1 className="catalog-title">In Game Catalog</h1>
      <div className="catalog-container">
        {avatars.map(avatar => (
          <div 
            key={avatar.id} 
            className="avatar-block"
          >
            <p>{avatar.name}</p>
            <img src={avatar.thumbnailImageUrl} />
            <div className="avatar-buttons">
              <button className="btn avatar-btn" onClick={() => changeAvatar(avatar.id)}>
                Select
              </button>
              <button className="btn avatar-btn" onClick={() => addToCustomAvatars(avatar.id, avatar.name, avatar.thumbnailImageUrl)}>
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

export default IngameCatalog;
