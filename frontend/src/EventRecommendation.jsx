import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePost from './usePost';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function EventRecommendation() {
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { postData } = usePost();

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    if (!question) {
      setErrorMessage("Please enter a question!");
      return;
    }

    const data = await postData(`${API_BASE_URL}/api/user/recommend/eventRecommendation`, { question });

    if (data && !data.error) {
      navigate('/EventRecommendationResult', { state: { question, data } });
    } else {
      setErrorMessage(data?.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Explore Recommended Adventures.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-500">
            Dive into personalized adventure suggestions tailored for you!
          </p>
          <div className="mx-auto mt-10 flex max-w-md gap-x-4 mb-5 w-screen">
            <input
              type="text"
              placeholder="What would you like to do today?"
              value={question}
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              onChange={handleQuestionChange}
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={handleSubmit}>
              Submit
            </button>
          </div>
          {errorMessage && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default EventRecommendation;
