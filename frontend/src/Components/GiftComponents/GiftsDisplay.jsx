import React, { useState } from "react";
import gift from "../../assets/gift.png";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function GiftsDisplay({recommendations, friend, disabled}) {

  const [ responseMessages, setResponseMessages ] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const handleAddGift = async (gift, index) => {
    
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    const giftData = {
      friendId: friend._id,
      friendName: friend.name,
      giftName: gift.giftName,
      reasons: gift.reasons,
      purchasePlace: gift.purchasePlace,
      imageUrl: gift.imageUrl
    };
    try {
      await axios.post(`${API_BASE_URL}/api/user/gift`, giftData);
      setResponseMessages(prev => ({ ...prev, [index]: "Gift added successfully!" }));
      setTimeout(() => {
        setResponseMessages(prev => ({ ...prev, [index]: "" }));
      }, 15000);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
        console.log("Gift already exists");
        setResponseMessages(prev => ({ ...prev, [index]: "This gift has already been added." }));
      } else {
        console.error("Error adding gift:", error.message || "Unknown error");
        setResponseMessages(prev => ({ ...prev, [index]: `Failed to add gift: ${error.message || "Unknown error"}` }));
      }

      setTimeout(() => {
        setResponseMessages(prev => ({ ...prev, [index]: "" }));
      }, 15000);
    }
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  }


    return (
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <div className="mt-10 space-y-20 lg:mt-10 lg:space-y-20">
          {recommendations.map((recommendation, index) => (
          <article key={recommendation.giftName || index} className="relative isolate flex flex-col gap-4 lg:flex-row">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-52 lg:shrink-0">
              <img
                src={recommendation.imageUrl && !recommendation.imageUrl.error ? recommendation.imageUrl : gift}
                alt={recommendation.imageUrl && !recommendation.imageUrl.error ? recommendation.giftName : "Gift Image"}
                className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
              />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>
            <div>
              <div className="group relative max-w-xl">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  {recommendation.giftName}
                </h3>
                <p className="mt-5 text-sm leading-6 text-gray-600">{recommendation.reasons}</p>
              </div>
              <div className="mt-6 flex border-t border-gray-900/5 pt-4">
                <div className="relative flex items-center gap-x-4 w-full">
                  <div className="text-sm leading-6 flex justify-between items-start w-full">
                    <p className="text-gray-600 flex-1 mr-4">{recommendation.purchasePlace}</p>
                    <div className="mt-1 flex flex-col items-end">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleAddGift(recommendation, index)}
                        className="rounded bg-fuchsia-100 px-2 py-1 text-xs font-semibold text-fuchsia-900 shadow-sm hover:bg-fuchsia-50"
                      >
                        Add to gift list
                      </button>
                      {responseMessages[index] && <span className="mt-2 text-xs text-fuchsia-300">{responseMessages[index]}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
export default GiftsDisplay;