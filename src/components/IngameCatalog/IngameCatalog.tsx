import "./styles.css"
import type { SiteAvatar } from "@/types"
import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from 'react';


const IngameCatalog = () => {
  const [avatars, setAvatars] = useState<SiteAvatar[]>([]);
  const [filteredAvatars, setFilteredAvatars] = useState<SiteAvatar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    setFilteredAvatars(avatars.filter(avatar =>
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [avatars, searchQuery]);

  const getFavoriteAvatars = async (category: string) => {
    const avatars: string = await invoke("get_favorite_avatars", { category: category })
    const parsedAvatars: SiteAvatar[] = JSON.parse(avatars)

    setAvatars(parsedAvatars)
  }

  const getUploadedAvatars = async () => {
    const avatars: string = await invoke("get_uploaded_avatars")
    const parsedAvatars: SiteAvatar[] = JSON.parse(avatars)

    setAvatars(parsedAvatars)
  }

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
    getFavoriteAvatars("avatars1");
  }, [])

  return (
    <>
      <h1 className="catalog-title">In Game Catalog</h1>
      <div className="favorites-category-container">
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars1")}>1</div>
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars2")}>2</div>
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars3")}>3</div>
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars4")}>4</div>
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars5")}>5</div>
        <div className="favorites-category" onClick={() => getFavoriteAvatars("avatars6")}>6</div>
        <div className="favorites-category" onClick={() => getUploadedAvatars()}>Uploaded</div>
      </div>
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
