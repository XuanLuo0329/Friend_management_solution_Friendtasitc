export default function AboutPage() {
    return (
        <div className="relative isolate overflow-hidden py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <p className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Your Personal Companion for Memorable Friendships</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Friendtastic</h1>
                    <p className="mt-6 text-xl leading-8 text-gray-700">
                        In a world that moves at an ever-accelerating pace, maintaining and nurturing personal relationships can sometimes fall by the wayside. Friendtastic was born out of the idea that meaningful connections should not be lost in the hustle and bustle of daily life.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
                    <div className="relative lg:order-last lg:col-span-5">

                        <figure className="border-l border-indigo-600 pl-8">
                            <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                                <p>
                                    “We are a team of tech enthusiasts and advocates for deep interpersonal connections. At Friendtastic, we harness the power of technology to create a web-based platform that simplifies the complexity of social management. Our goal is to help individuals, especially introverts who may find the social sphere daunting, to cultivate and maintain fulfilling relationships with ease and joy”
                                </p>
                            </blockquote>
                            <figcaption className="mt-8 flex gap-x-4">
                                <div className="text-sm leading-6">
                                    <div className="font-semibold text-gray-900">An anonymous INTP</div>
                                    <div className="text-gray-600">Founder of Friendtastic</div>
                                </div>
                            </figcaption>
                        </figure>
                    </div>
                    <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
                        <p>
                            Our features are thoughtfully designed to address the nuances of personal connections. From remembering birthdays and anniversaries to suggesting the perfect gift, Friendtastic acts as your personal companion in the journey of friendship. We believe in the magic of memories, the importance of celebrations, and the value of understanding each other deeply. This is why we have incorporated AI-driven recommendations, a dedicated memory-recording space, and interaction advice based on personality types, ensuring no detail is missed and every relationship is cherished.
                        </p>
                        <p className="mt-8">
                            With a focus on intuitive design and user experience, we strive to make Friendtastic not just a tool, but a haven for those who value their relationships. As we continue to innovate and expand our features, our commitment remains the same: to help you connect deeper, stress less, and celebrate the essence of friendship.
                        </p>

                        <p className="mt-6">
                            Welcome to Friendtastic – your space to foster, manage, and revel in the friendships that make life truly spectacular.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
