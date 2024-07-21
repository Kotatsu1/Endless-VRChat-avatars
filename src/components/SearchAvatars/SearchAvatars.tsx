import "./styles.css";
import type { SearchAvatar } from "@/types";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import React from "react";
import unavailableAvatar from "@/assets/unavailable-avatar.png";
import { RootState } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import { searchActions } from "@/redux";


const SearchAvatars = () => {
	const [isPaginationHandled, setIsPaginationHandled] = useState(false);
	const [loading, setLoading] = useState(false);
	const avatars = useSelector((state: RootState) => state.search.avatars);
	const searchQuery = useSelector(
		(state: RootState) => state.search.searchQuery
	);
	const page = useSelector((state: RootState) => state.search.page);
	const totalPages = useSelector(
		(state: RootState) => state.search.totalPages
	);
	
	const dispatch = useDispatch();
	
	const setAvatars = (avatars: SearchAvatar[]) => {
		dispatch(searchActions.setAvatars(avatars));
	};
	
	const setSearchQuery = (searchQuery: string) => {
		dispatch(searchActions.setSearchQuery(searchQuery));
	};
	
	const setPage = (page: number) => {
		setIsPaginationHandled(true);
		dispatch(searchActions.setPage(page));
	};
	
	const setTotalPages = (totalPages: number) => {
		dispatch(searchActions.setTotalPages(totalPages));
	};
	
	const searchByTitle = async (
		page: number,
		event: React.FormEvent | null = null
	) => {
		if (!searchQuery) return;
		setLoading(true);
		setAvatars([]);
		if (event) {
			event.preventDefault();
		}
		
		setPage(page);
		const avatars: string = await invoke("search_avatars", { searchQuery });
		
		const splittedAvatars = avatars.split("\n");
		
		const pageSize = 30;
		const totalPages = Math.ceil(splittedAvatars.length / pageSize);
		setTotalPages(totalPages);
		
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedAvatars = splittedAvatars.slice(startIndex, endIndex);
		
		const convertedToObjects = await Promise.all(
			paginatedAvatars.map(async (avatar) => {
				const [avtr, ,] = avatar.split("|");
				const rawAvatarInfo: string = await invoke("get_avatar_info", {
					avtr,
				});
				const parsedAvatarInfo = JSON.parse(rawAvatarInfo);
				const thumbnailUrl = parsedAvatarInfo.thumbnailImageUrl;
				const title = parsedAvatarInfo.name;
				
				return { avtr, title, thumbnailUrl };
			})
		);
		setLoading(false);
		setAvatars(convertedToObjects);
		setIsPaginationHandled(true);
	};
	
	const changeAvatar = async (avatarId: string) => {
		const existsingAvatar = await invoke("get_existing_avatar_cmd", {
			avtr: avatarId,
		});
		
		if (existsingAvatar) {
			await invoke("update_avatar_last_used_cmd", { avtr: avatarId });
		}
		const res = await invoke("change_avatar", { avatarId });
		console.log("avtr change", res);
	};
	
	const addToCustomAvatars = async (
		avtr: string,
		title: string,
		thumbnailUrl: string
	) => {
		const existsingAvatar = await invoke("get_existing_avatar_cmd", {
			avtr,
		});
		
		if (existsingAvatar) {
			console.log("Avatar already exists");
			return;
		}
		const res = await invoke("add_avatar_cmd", {
			avtr,
			title,
			thumbnailUrl,
		});
		console.log("avtr to custom", res);
	};
	
	useEffect(() => {
		if (isPaginationHandled) {
			searchByTitle(page);
		}
	}, [page]);
	


	// This is something stupid and I maybe need to fix later, but who even cares
	
	const scrollbarValue = useSelector(
		(state: RootState) => state.search.scrollbarValue
	);
	
	const handleScroll = () => {
		const scrollbarValue = window.scrollY;
		dispatch(searchActions.setScrollbarValue(scrollbarValue));
	};
	
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	
	useEffect(() => {
		window.scrollTo(0, scrollbarValue);
	}, [scrollbarValue]);
	
	//



	return (
		<>
			<h1 className="catalog-title">Search Avatars</h1>
			<div className="input-container">
				<form onSubmit={(e) => searchByTitle(1, e)}>
					<input
						className="search-query"
						type="text"
						placeholder="Avatar title"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<button className="btn" type="submit">
						Search
					</button>
				</form>
			</div>
			<div className="catalog-container">
				{loading && <div className="loader-spinner" />}
				{avatars.map((avatar) => (
					<div key={avatar.avtr} className="avatar-block">
						<p className="avatar-title">{avatar.title}</p>
						<img
						src={
							avatar.thumbnailUrl
							? avatar.thumbnailUrl
							: unavailableAvatar
						}
						alt="Avatar"
						onError={(e) => {
							e.currentTarget.src = unavailableAvatar;
							e.currentTarget.onerror = null;
						}}
						/>
						<div className="avatar-buttons">
						<button
							className="btn avatar-btn"
							onClick={() => changeAvatar(avatar.avtr)}
						>
						Select
						</button>
						<button
							className="btn avatar-btn"
							onClick={() =>
								addToCustomAvatars(
									avatar.avtr,
									avatar.title,
									avatar.thumbnailUrl
								)
							}
						>
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
			{avatars[0]?.avtr && (
				<div className="pagination">
					<button
						className="btn"
						onClick={() => setPage(1)}
						disabled={page === 1}
						style={
							page === 1
							? { backgroundColor: "gray" }
							: {}
						}
					>
						First
					</button>
				<button
					className="btn"
					style={page === 1 ? { backgroundColor: "gray" } : {}}
					onClick={() => setPage(page - 1)}
					disabled={page === 1}
				>
					Prev
				</button>

				{Array.from({ length: 7 }, (_, i) => {
					const newPage = page + i - 3;
					const isValidPage = newPage >= 1 && newPage <= totalPages;
					if (!isValidPage) {
						return null;
					}
					return (
						<button
							key={i}
							className={`btn ${
								newPage === page ? "active" : ""
							}`}
							onClick={() => setPage(newPage)}
							disabled={!isValidPage}
						>
							{newPage}
						</button>
					);
				})}

				<button
					className="btn"
					disabled={page === totalPages}
					style={
						page === totalPages
						? { backgroundColor: "gray" }
						: {}
					}
					onClick={() => setPage(page + 1)}
				>
				Next
				</button>
				<button
					className="btn"
					onClick={() => setPage(totalPages)}
					disabled={page === totalPages}
					style={
						page === totalPages
						? { backgroundColor: "gray" }
						: {}
					}
				>
				{totalPages}
				</button>
				</div>
			)}
		</>
	);
};

export default SearchAvatars;
