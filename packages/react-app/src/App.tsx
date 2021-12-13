import { Fragment, ReactNode, useCallback, useMemo, useState } from 'react'
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import fetch from 'unfetch'
import useSWR from 'swr'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationIcon,
} from '@heroicons/react/solid'
import { QuizHero } from './components/QuizHero'

// quiz
// question
// answer

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function Container(props: { children?: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">{props.children}</div>
    </div>
  )
}

// interface Answer {
//   text: string
// }
//
// interface Question {
//   id: number
//   text: string
//   imageUrl: string
//   answers: Answer[]
//   quizzes: number[]
// }

interface Question {
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
      <QuizHero />

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

interface QuizQuestionProps {
  imageUrl: string
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function QuizQuestion(props: {
  question: Question
  value: string
  onChange: (value: string) => void
  error: boolean
  showAnswer: boolean
}) {
  return (
    <div className="space-y-3">
      <div className="max-w-xl">
        <img src={props.question.img} alt={props.question.name} />
      </div>
      <div className="sm:flex sm:items-center">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="answer" className="sr-only">
            Answer
          </label>
          <input
            type="text"
            name="answer"
            id="answer"
            className={classNames(
              props.error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'focus:ring-indigo-500 focus:border-indigo-500 border-gray-300',
              'shadow-sm block w-full sm:text-sm rounded-md'
            )}
            placeholder="Answer"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
          {props.showAnswer && (
            <p
              className={classNames(
                props.error ? 'text-red-600' : 'text-gray-500',
                'mt-2 text-sm'
              )}
            >
              Answer: {props.question.name}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface AlertProps {
  type: 'warning' | 'success'
  message: ReactNode
}

function WarningAlert(props: { message: ReactNode }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">{props.message}</p>
        </div>
      </div>
    </div>
  )
}

function SuccessAlert(props: { message: ReactNode }) {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">{props.message}</p>
        </div>
      </div>
    </div>
  )
}

function Alert(props: AlertProps) {
  switch (props.type) {
    case 'warning':
      return <WarningAlert message={props.message} />
    case 'success':
      return <SuccessAlert message={props.message} />
  }
}

function useGetQuiz() {
  return useSWR<Question[]>('/data/typefaces.json', fetcher)
}

function TakeQuiz() {
  const [visibleAnswers, setVisibleAnswers] = useState(new Set<number>())
  const [answers, setAnswers] = useState(new Map<number, string>())
  const [questionErrors, setQuestionErrors] = useState(new Set<number>())
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

  const onToggleAnswers = useCallback(() => {
    setVisibleAnswers((preAnswers) => {
      if (preAnswers.size > 0) {
        return new Set()
      }

      return new Set(questions.map((question) => question.id))
    })
  }, [questions])

  const onCheckAnswers = useCallback(() => {
    setQuestionErrors(() => {
      const errors = new Set<number>()

      quizQuestions.forEach((question) => {
        if (
          question.name.toLowerCase().replace(' ', '').trim() !==
          answers.get(question.id)?.toLowerCase().replace(' ', '').trim()
        ) {
          errors.add(question.id)
        }
      })

      return errors
    })

    setVisibleAnswers(() => {
      return new Set(questions.map((question) => question.id))
    })
  }, [quizQuestions, questions, answers])

  const onReset = useCallback(() => {
    setAnswers(() => {
      return new Map()
    })
    setQuestionErrors(() => {
      return new Set()
    })
    setVisibleAnswers(() => {
      return new Set()
    })
  }, [])

  const onAnswerChange = useCallback((questionId: number, answer: string) => {
    setAnswers((preAnswers) => {
      const answersCopy = new Map(preAnswers.entries())
      answersCopy.set(questionId, answer)
      return answersCopy
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <Link
          to=".."
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Quizzes
        </Link>
      </div>

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Quiz 1
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onToggleAnswers}
          >
            Toggle Answers
          </button>

          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onCheckAnswers}
          >
            Check Answers
          </button>
        </div>
      </div>

      {questionErrors.size > 0 && (
        <Alert
          type="warning"
          message={`${questionErrors.size} out of ${quizQuestions.length} answers incorrect.`}
        />
      )}

      {questionErrors.size == 0 && answers.size > 0 && (
        <Alert type="success" message="Congrats! All answers correct." />
      )}

      <ul role="list" className="divide-y divide-gray-200">
        {quizQuestions.map((question) => {
          return (
            <li className="py-4">
              <QuizQuestion
                key={question.id}
                question={question}
                value={answers.get(question.id) ?? ''}
                onChange={(answer) => onAnswerChange(question.id, answer)}
                error={questionErrors.has(question.id)}
                showAnswer={visibleAnswers.has(question.id)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function AppLayout() {
  return (
    <Container>
      <div className="py-10">
        <Outlet />
      </div>
    </Container>
  )
}

export function App() {
  return (
    <Routes>
      <Route path={'/'} element={<AppLayout />}>
        <Route index element={<Navigate to={'/quizzes'} />} />
        <Route path={'quizzes'} element={<Outlet />}>
          <Route path={':quizId'} element={<TakeQuiz />} />
          <Route index element={<QuizList />} />
        </Route>
      </Route>
    </Routes>
  )
}
