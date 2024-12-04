import styles from "../styles/endless.module.css"
import { invoke } from "../api";
import { useEffect, useState } from "react";
import { Avatar } from "../types";

export const Saved = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([])


  const getSavedAvatars = async () => {
    const avatars = await invoke("avatars.get_saved_avatars")

    setAvatars(avatars)
  }


  useEffect(() => {
    getSavedAvatars()
  }, [])


  const changeAvatar = async (id: string) => {
    await invoke("avatars.change_avatar", id)
  }


  const removeAvatarFromSaved = async (id: string) => {
    await invoke("avatars.remove_avatar_from_saved", id)
  }


  return (
    <div className={styles.background}>
      Saved

      {avatars?.map(avatar => (
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
            <button className="btn avatar-btn" onClick={() => removeAvatarFromSaved(avatar.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
