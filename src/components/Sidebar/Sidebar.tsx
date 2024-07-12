import "./styles.css"
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/tauri";
import { RootState } from "@/redux"
import { useSelector } from "react-redux"
import { listen } from '@tauri-apps/api/event'



const Sidebar = () => {
  const userInfo = useSelector((state: RootState) => state.user.info)

  const [avatarThumbnail, setAvatarThumbnail] = useState("");
  const [avatarTitle, setAvatarTitle] = useState("");

  const [newRelease, setNewRelease] = useState("");

  const getAvatarInfo = async (userId: string) => {
    const rawAvatarInfo: string = await invoke("get_current_avatar", { userId });
    const parsedAvatarInfo = JSON.parse(rawAvatarInfo);

    setAvatarThumbnail(parsedAvatarInfo.thumbnailImageUrl)
    setAvatarTitle(parsedAvatarInfo.name)
  }

  const checkNewRelease = async () => {
    const rawReleasesInfo: string = await invoke("get_releases_info");
    const parsedReleasesInfo = JSON.parse(rawReleasesInfo);

    const latestReleaseVersion = parsedReleasesInfo[0].tag_name;
    const currentReleaseVersion = "0.0.6";

    if (latestReleaseVersion !== currentReleaseVersion) {
      setNewRelease(latestReleaseVersion);
    }
  }

  useEffect(() => {
    checkNewRelease()
    getAvatarInfo(userInfo.id)
    const setupListener = async () => {
      const unlisten = await listen('avatar_changed', async (event) => {
        console.log('Avatar added event received:', event);
        await getAvatarInfo(userInfo.id)
      });

      return () => {
        unlisten();
      };
    };

    setupListener();
  }, []);

  return (
    <>
      <div className="sidebar-container">
        <div className="current-avatar">
          <div>{avatarTitle}</div>
          <img src={avatarThumbnail} />
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="linkto">Custom Catalog</Link>
          </li>
          <li>
            <Link to="/ingame" className="linkto">In Game Catalog</Link>
          </li>
          <li>
            <Link to="/search" className="linkto">Search Avatars</Link>
          </li>
          <li>
            <Link to="/support" className="linkto">Support</Link>
          </li>
        </ul>
        {
          newRelease ? 
          <a 
            href={`https://github.com/kotatsu1/Endless-VRChat-avatars/releases/tag/${newRelease}`} 
            target="_blank" 
            className="new-release"
          >
            <strong>New Release available</strong>
          </a>
           : 
          <div className="new-release"><strong>Latest version</strong></div>
        }
      </div>
    </>
  )
}

export default Sidebar;
