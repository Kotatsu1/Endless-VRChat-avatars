import "./styles.css"
import type { AvatarSite } from "@/types"
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from 'react';


const IngameCatalog = () => {
  const [avatars, setAvatars] = useState<AvatarSite[]>([]);

  const getFavoriteAvatars = async () => {
    const avatars: string = await invoke("get_favorite_avatars")
    const parsedAvatars: AvatarSite[] = JSON.parse(avatars)
    setAvatars(parsedAvatars)
  }

  const changeAvatar = async (avatarId: string) => {
    const res = await invoke("change_avatar", { avatarId });
    console.log("avtr change", res)
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
            <p>[rank]</p>
            <img src={avatar.thumbnailImageUrl} />
            <div className="avatar-buttons">
              <button className="btn avatar-btn" onClick={() => changeAvatar(avatar.id)}>
                Select
              </button>
            </div>
          </div>
        ))}
          <div className="dummy" />
          <div className="dummy" />
          <div className="dummy" />
      </div>
    </>
  )
}

export default IngameCatalog;
