import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function EventRecommendationResult() {
    const location = useLocation();
    const { data } = location.state;

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Discover Your Connections
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Uncover the best activities and companions for your next adventure. Based on your interests, we've tailored two top recommendations just for you!
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {data.recommendations.map((feature, index) => (
                            <div key={index} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            <br /><br />
            <div className="flex justify-center">
            <Link to="/EventRecommendation">
            <button
                type="button"
                className="mx-auto rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                Change your mind? Try again!
            </button>
            </Link>
            </div>
        </div>
    )
}