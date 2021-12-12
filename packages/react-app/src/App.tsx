// quiz
// question

import {ReactNode} from "react";

function Container(props: { children?: ReactNode }) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{props.children}</div>
}

const items = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
]

export default function QuizList() {
    return (
        <ul role="list" className="divide-y divide-gray-200">
            {items.map((item) => (
                <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Quiz Name</p>
                        </div>
                        <div>
                            <a
                                href="#"
                                className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Start
                            </a>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

function Hero() {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Type Review.
                    </p>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                        Test your knowledge of typefaces.
                    </p>
                </div>
            </div>
        </div>
    )
}

export function App() {
    return (
        <Container>
            <Hero />
            <div className="py-10">
                <div className="pb-5 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Select a Quiz</h3>
                </div>

                <QuizList />
            </div>
        </Container>
    )
}
