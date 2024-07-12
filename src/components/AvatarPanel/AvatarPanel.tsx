import "./styles.css"
import { invoke } from "@tauri-apps/api/tauri";
import { emit } from '@tauri-apps/api/event'
import { useState } from "react";

import { RootState } from "@/redux"
import { useSelector } from "react-redux"


const AvatarPanel = () => {
  const [avtr, setAvtr] = useState('');
  const userInfo = useSelector((state: RootState) => state.user.info)

  const addAvatar = async (avtr: string) => {
    try {
      const existsingAvatar = await invoke('get_existing_avatar_cmd', { avtr })

      if (existsingAvatar) {
        console.log('Avatar already exists');
        return;
      }

      const rawAvatarInfo: string = await invoke('get_avatar_info', { avtr })
      const parsedAvatarInfo = JSON.parse(rawAvatarInfo);

      const title = parsedAvatarInfo.name;
      const thumbnailUrl = parsedAvatarInfo.thumbnailImageUrl;

      await invoke('add_avatar_cmd', { avtr, title, thumbnailUrl });
      console.log('Avatar added successfully');
    } catch (error) {
      console.error('Failed to add avatar:', error);
    }
  }

  const addCurrentAvatar = async () => {
    try {
      const rawAvatarInfo: string = await invoke("get_current_avatar", { userId: userInfo.id });
      const parsedAvatarInfo = JSON.parse(rawAvatarInfo);

      await addAvatar(parsedAvatarInfo.id)

      emit('avatar_changed', {
        theMessage: 'Avatar changed successfully!',
      })

      console.log('Avatar added successfully');
    } catch (error) {
      console.error('Failed to add avatar:', error);
    }
  }

  return (
    <>
      <div className="avatar-panel-container">
        <div>
          <input
            className="avtr-input"
            type="text"
            placeholder="avtr"
            value={avtr}
            onChange={(e) => setAvtr(e.target.value)}
          />
          <button className="btn" onClick={() => addAvatar(avtr)}>
            Add avtr
          </button>
        </div>
        <div>
          <button className="btn" onClick={addCurrentAvatar}>
            Add current avatar
          </button>
        </div>
      </div>
    </>
  )
}

export { AvatarPanel };
