import styles from "../styles/search.module.css"
import { invoke } from "../api";
import { useEffect, useState } from "react";
import { Avatar, AvatarSearch } from "../types";


export const Search = () => {
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [totalPages, setTotalPages] = useState(0)

  const searchAvatars = async (query: string) => {
    // query, page
    const request: AvatarSearch = await invoke("avatars.search_avatars", query, 1)

    setAvatars(request.avatars)
    setTotalPages(request.totalPages)
  }


  useEffect(() => {
    searchAvatars("manuka")
  }, [])


  const changeAvatar = async (id: string) => {
    await invoke("avatars.change_avatar", id)
  }


  const addToSavedAvatars = async (avtr: string, title: string, thumbnail: string) => {
    await invoke("avatars.add_avatar_to_saved", {avtr, title, thumbnail})
  }


  return (
    <div className={styles.background}>
      Search
      total pages {totalPages}

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
            <button className="btn avatar-btn" onClick={() => addToSavedAvatars(avatar.id, avatar.name, avatar.thumbnailImageUrl)}>
              To Custom
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
