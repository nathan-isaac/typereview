// quiz
// question

import { Fragment, ReactNode, useMemo } from 'react'
import {
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useParams,
} from 'react-router-dom'
import fetch from 'unfetch'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function Container(props: { children?: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  )
}

interface Typeface {
  id: number
  name: string
  img: string
  quizzes: number[]
}

interface Quiz {
  quizId: number
  name: string
}

function useGetQuizzes() {
  return useSWR<Quiz[]>('/data/quizzes.json', fetcher)
}

export default function QuizList() {
  const { data } = useGetQuizzes()

  const quizzes = useMemo(() => {
    return data ?? []
  }, [data])

  return (
    <Fragment>
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Select a Quiz
        </h3>
      </div>

      <ul role="list" className="divide-y divide-gray-200">
        {quizzes.map((item) => (
          <li key={item.quizId} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
              </div>
              <div>
                <Link
                  to={`${item.quizId}`}
                  className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                >
                  Start
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

function QuizQuestion(props: Typeface) {
  return (
    <div>
      <div>
        <img src={props.img} alt={props.name} />
      </div>
      <div>{props.name}</div>
    </div>
  )
}

function useGetQuiz() {
  return useSWR<Typeface[]>('/data/typefaces.json', fetcher)
}

function TakeQuiz() {
  const params = useParams<'quizId'>()
  const { data } = useGetQuiz()

  const questions = useMemo(() => {
    return data ?? []
  }, [data])

  const quizQuestions = useMemo(() => {
    return questions.filter((question) =>
      question.quizzes.includes(Number(params.quizId))
    )
  }, [questions])

  return (
    <div>
      Quiz Questions
      {quizQuestions.map((question) => {
        return <QuizQuestion key={question.id} {...question} />
      })}
    </div>
  )
}

function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Type Review
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
        <Routes>
          <Route path={'/'} element={<Navigate to={'/quizzes'} />} />
          <Route path={'quizzes'} element={<Outlet />}>
            <Route path={':quizId'} element={<TakeQuiz />} />
            <Route index element={<QuizList />} />
          </Route>
        </Routes>
      </div>
    </Container>
  )
}
