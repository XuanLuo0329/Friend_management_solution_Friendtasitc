import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
}

function FriendProfileSlideOver({ friend, disabled }) {

  const navigate = useNavigate();

  // Define the fetchData function
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/gift/${friend._id}`);
      // Navigate after successful fetch
      navigate('/giftList', { state: { gifts: response.data } });
    } catch (error) {
      console.error('Error fetching gifts:', error);
    }
  };

  // Trigger fetchData on button click
  const handleClick = () => {
    fetchData();
  };


  return (
    <div>
      <div className="pointer-events-auto w-screen max-w-md sm:w-full">
        <div className="flex w-full h-full flex-col bg-white shadow-xl">
          {/* Main */}
          <div className="pb-1 sm:pb-6">
            <div>
              <div className="px-4 sm:mt-5 sm:flex sm:items-end sm:px-6">
                <div className="sm:flex-1">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{friend.name}</h3>
                    </div>
                  </div>
                <div className="mt-6 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0"> 
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled}
                    className="inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1"
                  >
                    Gift List
                  </button>        
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
          <dl className="space-y-5 px-4 sm:space-y-6 sm:px-6">
            <div>
              <dt className="mt-1 text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Birthday</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                {formatDate(friend.birthday)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Relationship</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{friend.relationship}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">MBTI</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{friend.mbtiType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Hobbies</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                <ul>
                  {friend.hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Skills</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                <ul>
                  {friend.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Likes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                <ul>
                  {friend.preferences.likes.map((like, index) => (
                    <li key={index}>{like}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">Disikes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                <ul>
                  {friend.preferences.dislikes.map((dislike, index) => (
                    <li key={index}>{dislike}</li>
                ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
  )
};

export default FriendProfileSlideOver;
