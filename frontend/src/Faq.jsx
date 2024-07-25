import { Disclosure } from '@headlessui/react'
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    question: "What is Friendtastic?",
    answer:
      "Friendtastic is a web-based application designed to help you manage and enhance your personal relationships. It integrates smart technology to keep track of important events, suggests personalized gifts, helps record memories, and even aids in maintaining your connections through tailored event recommendations.",
  },
  {
    question: "How does the AI-powered gift recommendation work?",
    answer:
      "Our AI-powered gift recommendation feature analyzes your friend’s profile, including their hobbies, preferences, and past feedback to suggest unique gift ideas that resonate with their interests. It learns over time, so the more you use it, the better the recommendations get!",
  },
  {
    question: "Can I record memories of my friendships within the app?",
    answer:
      "Absolutely! Friendtastic offers a Memory Recording Section where you can store cherished memories, photos, and notes about the good times you’ve shared with your friends. This way, you can keep a personal history of your relationships all in one place.",
  },
  {
    question: "Is my data safe with Friendtastic?",
    answer:
      "Protecting your data is our top priority. We use advanced security measures to ensure your information is kept private and secure. You can control your privacy settings and decide what you want to share and with whom.",
  },
  {
    question: "Do I need technical skills to use Friendtastic?",
    answer:
      "Not at all! Friendtastic is built with a user-friendly interface, making it easy for anyone to navigate and use. If you can use a web browser, you can use Friendtastic.",
  },
]

export default function FAQ() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
      <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
        <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
          {faqs.map((faq) => (
            <Disclosure as="div" key={faq.question} className="pt-6">
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                      <span className="text-base font-semibold leading-7">{faq.question}</span>
                      <span className="ml-6 flex h-7 items-center">
                        {open ? (
                          <FaMinus className="h-6 w-6" aria-hidden="true" />
                        ) : (
                          <FaPlus className="h-6 w-6" aria-hidden="true" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="mt-2 pr-12">
                    <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </dl>
      </div>
    </div>
  )
}
