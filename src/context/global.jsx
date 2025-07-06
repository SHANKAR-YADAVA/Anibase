import React, { createContext, useContext, useReducer, useState, useEffect, useMemo } from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

// Action types
const ActionTypes = {
  LOADING: "LOADING",
  SEARCH: "SEARCH",
  GET_POPULAR_ANIME: "GET_POPULAR_ANIME",
  GET_UPCOMING_ANIME: "GET_UPCOMING_ANIME",
  GET_AIRING_ANIME: "GET_AIRING_ANIME",
  GET_PICTURES: "GET_PICTURES"
};

// Initial state
const initialState = {
  popularAnime: [],
  upcomingAnime: [],
  airingAnime: [],
  pictures: [],
  isSearch: false,
  searchResults: [],
  loading: false
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOADING:
      return { ...state, loading: true };
    case ActionTypes.GET_POPULAR_ANIME:
      return { ...state, popularAnime: action.payload, loading: false };
    case ActionTypes.SEARCH:
      return { ...state, searchResults: action.payload, isSearch: true, loading: false };
    case ActionTypes.GET_UPCOMING_ANIME:
      return { ...state, upcomingAnime: action.payload, loading: false };
    case ActionTypes.GET_AIRING_ANIME:
      return { ...state, airingAnime: action.payload, loading: false };
    case ActionTypes.GET_PICTURES:
      return { ...state, pictures: action.payload, loading: false };
    default:
      return state;
  }
}

// Provider
export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      searchAnime(search);
    } else {
      alert("Please enter a search term");
    }
  };

  const getPopularAnime = async () => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const res = await fetch(`${baseUrl}/top/anime?filter=bypopularity`);
      const data = await res.json();
      dispatch({ type: ActionTypes.GET_POPULAR_ANIME, payload: data.data });
    } catch (error) {
      console.error("Error fetching popular anime:", error);
    }
  };

  const getUpcomingAnime = async () => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const res = await fetch(`${baseUrl}/top/anime?filter=upcoming`);
      const data = await res.json();
      dispatch({ type: ActionTypes.GET_UPCOMING_ANIME, payload: data.data });
    } catch (error) {
      console.error("Error fetching upcoming anime:", error);
    }
  };

  const getAiringAnime = async () => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const res = await fetch(`${baseUrl}/top/anime?filter=airing`);
      const data = await res.json();
      dispatch({ type: ActionTypes.GET_AIRING_ANIME, payload: data.data });
    } catch (error) {
      console.error("Error fetching airing anime:", error);
    }
  };

  const searchAnime = async (query) => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const res = await fetch(`${baseUrl}/anime?q=${query}&order_by=popularity&sort=asc&sfw`);
      const data = await res.json();
      dispatch({ type: ActionTypes.SEARCH, payload: data.data });
    } catch (error) {
      console.error("Error searching anime:", error);
    }
  };

  const getAnimePictures = async (id) => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      const res = await fetch(`${baseUrl}/characters/${id}/pictures`);
      const data = await res.json();
      dispatch({ type: ActionTypes.GET_PICTURES, payload: data.data });
    } catch (error) {
      console.error("Error fetching anime pictures:", error);
    }
  };

  useEffect(() => {
    getPopularAnime();
  }, []);

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...state,
    search,
    handleChange,
    handleSubmit,
    getPopularAnime,
    getUpcomingAnime,
    getAiringAnime,
    getAnimePictures
  }), [state, search]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return context;
};
