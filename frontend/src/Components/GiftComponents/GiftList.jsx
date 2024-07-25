import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FriendsSelector from "./FriendsSelector.jsx";
import axios from "axios";
import useSessionStorageState from "../../useSessionStorageState.js";
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function GiftList() {
  const location = useLocation();
  const { gifts: initialGifts } = location.state || {};
  const [selectedFriend, setSelectedFriend] = useSessionStorageState('selectedFriend', null);
  const [gifts, setGifts] = useState(initialGifts); // Initialized with gifts from location state if available
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFriend) {
      fetchGifts();
    }
  }, [selectedFriend]);

  const fetchGifts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/gift/${selectedFriend._id}`);
      setGifts(response.data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
  };

  const handleDelete = async (gift) => {
    // Confirmation dialog
    if (window.confirm(`Are you sure you want to delete the gift: ${gift.giftName}?`)) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/user/gift/${gift._id}`);
        if (response.status === 200) {
          alert('Gift deleted successfully!');
          // Filter out the deleted gift from the gifts state
          setGifts(gifts.filter(g => g._id !== gift._id));
        } else if (response.status === 404) {
          throw new Error('Failed to delete the gift');
        }
      } catch (error) {
        alert('Error deleting gift: ' + error.message);
      }
    }
  }

  const handleNavigate = () => {
    navigate('/giftRecommendation');
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="mt-10 mx-auto w-full max-w-screen grow lg:flex xl:justify-center gap-x-16">
        <FriendsSelector onSelect={handleSelectFriend}/>
        <div className="flex items-end">
          <button 
            type="button"
            onClick={handleNavigate}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Back to Gift Page
          </button>
          </div>
        </div>
      <div className="mt-5 mx-auto w-full max-w-screen grow lg:flex xl:justify-center">
        <ul role="list" className="divide-y divide-gray-100">
        {gifts && gifts.length > 0 ? (
          gifts.map((gift) => (
          <li key={gift._id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-x-3">
                <img className="h-24 w-24 flex-none rounded-full bg-gray-50" src={`${API_BASE_URL}/${gift.imageUrl}` || gift}  alt={`Gift: ${gift.giftName}`} />
                <div className="group relative max-w-xl mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p>
                    <span className="text-sm font-semibold text-gray-900">{gift.giftName}</span>
                    <span className="font-semibold text-gray-600"> - For {gift.friendName}</span>
                    <br/><br/>
                    {gift.reasons}
                    <br/><br/>
                    <p className="text-xs">{gift.purchasePlace}</p>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <button
                onClick={() => handleDelete(gift)}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                Delete
              </button>
            </div>
        </li>
      )) 
    ) : (
      <li className="text-center text-gray-500">No gifts found</li>
    )}
    </ul>
     </div>
    </div>
  )
}

export default GiftList;
