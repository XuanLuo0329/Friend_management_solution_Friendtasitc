import React, { useState, useEffect, useRef} from "react";
import FriendsSelector from "./Components/GiftComponents/FriendsSelector.jsx";
import FriendProfileSlideOver from "./Components/GiftComponents/FriendProfileSlideOver.jsx";
import GiftCriteria from "./Components/GiftComponents/GiftCriteria.jsx";
import GiftsDisplay from "./Components/GiftComponents/GiftsDisplay.jsx";
import usePost from "./usePost";
import useSessionStorageState from "./useSessionStorageState.js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function GiftRecommendation() {

    const [selectedFriend, setSelectedFriend] = useSessionStorageState('selectedFriend', null);
    const [recommendations, setRecommendations] = useSessionStorageState('recommendations', null);
    const [giftPurpose, setGiftPurpose] = useSessionStorageState('giftPurpose', '');
    const [budgetMin, setBudgetMin] = useSessionStorageState('budgetMin', '');
    const [budgetMax, setBudgetMax] = useSessionStorageState('budgetMax', '');
    const [specificRequirements, setSpecificRequirements] = useSessionStorageState('specificRequirements', '');
    const [isSelected, setIsSelected] = useState(false);
    const [visible, setVisible ] = useState(true);
    const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
    const [hasClickedSubmit, setHasClickedSubmit] = useState(false);
    const { postData, loading, error } = usePost();

    const handleSelectFriend = (friend) => {
        setSelectedFriend(friend);
        setIsSelected(true);
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSelected) {
            const formData = {
                selectedFriend,
                giftPurpose,
                budgetMin,
                budgetMax,
                specificRequirements
            };
            const finalResponse = await postData(`${API_BASE_URL}/api/user/recommend/gift`, formData);
            if(finalResponse.success){
                setRecommendations(finalResponse.response);
                setHasSubmittedOnce(true);
            }else if(finalResponse.status === 429){
                alert('Exceeded AI API quota! Please inform the team to increase limit!');
            }
        }
        setHasClickedSubmit(true);
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');
        function handleResize(e) {
          if (e.matches) {
            setVisible(false);
          } else {
            setVisible(true);
          }
        }
        mediaQuery.addListener(handleResize);
        handleResize(mediaQuery);
        return () => mediaQuery.removeListener(handleResize);
    }, [setVisible]); 


    // update state
    useEffect(() => {
        setIsSelected(selectedFriend !== null);
        setHasSubmittedOnce(recommendations !== null);
    }, [selectedFriend,recommendations]);

    const friendsSelectorReset = useRef(() => {});

    const handleReset = () => {
        const keysToRemove = ['selectedFriend', 'recommendations', 'giftPurpose', 'budgetMin', 'budgetMax', 'specificRequirements'];
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        setSelectedFriend(null);
        setRecommendations(null);
        setGiftPurpose('');
        setBudgetMin('');
        setBudgetMax('');
        setSpecificRequirements('');
        setIsSelected(false);
        setHasSubmittedOnce(false);
        friendsSelectorReset.current(); // Call the current reset function stored in ref
    };

      
    return (
        <>
            <div className="flex min-h-full flex-col">
            {/* 3 column wrapper */}
                <div className="mx-auto w-full max-w-screen grow lg:flex xl:px-2">
                {/* Left sidebar & main wrapper */}
                    <div className={hasSubmittedOnce ? ("mt-3 flex-1 md:flex xl:justify-center"
                                                                          ):("mt-3 flex-1 sm:flex sm:justify-center")}>
                    <div className={hasSubmittedOnce ? ("mt-5 border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:w-72 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6"
                                                        ) : (
                                                        "mt-5 px-4 py-6 sm:px-6 lg:pl-8 xl:shrink-0 xl:pl-6")}>
                        <form onSubmit={handleSubmit}>
                            <FriendsSelector onSelect={handleSelectFriend} onReset={(resetFn) => { friendsSelectorReset.current = resetFn; } } disabled={loading}/>
                            {hasClickedSubmit && !isSelected && <p className="text-red-500">Please select a friend.</p>}
                            <GiftCriteria giftPurpose={giftPurpose}
                                            setGiftPurpose={setGiftPurpose}
                                            budgetMin={budgetMin}
                                            setBudgetMin={setBudgetMin}
                                            budgetMax={budgetMax}
                                            setBudgetMax={setBudgetMax}
                                            specificRequirements={specificRequirements}
                                            setSpecificRequirements={setSpecificRequirements}
                                            disabled={loading}
                            />
                            <div className="mt-8 flex items-center justify-end gap-x-6">
                                <button 
                                    type="button"
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="text-sm font-semibold leading-6 text-gray-900">
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                {loading ? ("Loading") : hasSubmittedOnce ? ("Retry"):("Submit")}
                                </button>
                            </div>
                        </form>
                    </div>
                    {hasSubmittedOnce && <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        {recommendations && <GiftsDisplay recommendations={recommendations} friend={selectedFriend} disabled={loading}/>}
                    </div>}

                    {visible && selectedFriend && isSelected && <div className="shrink-0 border-t border-gray-200 px-4 py-6 lg:w-64 lg:h-screen lg:border-l lg:border-t-0 lg:pr-4 ">
                        <FriendProfileSlideOver friend={selectedFriend} disabled={loading}/>
                    </div>}
                </div>
            </div>
        </div>
    </>
    );
};

export default GiftRecommendation;