import styles from "../styles/official.module.css"
import { invoke } from "../api";
import { useEffect, useState } from "react";
import { Avatar } from "../types";


export const Official = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([])


  const getUploadedAvatars = async () => {
    const avatars = await invoke("avatars.get_uploaded_avatars")

    setAvatars(avatars)
  }


  useEffect(() => {
    getUploadedAvatars()
  }, [])
 

  const changeAvatar = async (id: string) => {

  }


  const addToCustomAvatars = async (id: string, name: string, thumbnail: string) => {

  }


  return (
    <div className={styles.background}>
      Official

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

    </div>
  )
}
