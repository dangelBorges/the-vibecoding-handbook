import { Routes, Route } from 'react-router'
import { lazy } from 'react'
import Home from './pages/Home'

const Docs = lazy(() => import('./pages/Docs'))
const Prompts = lazy(() => import('./pages/Prompts'))
const Tools = lazy(() => import('./pages/Tools'))
const Templates = lazy(() => import('./pages/Templates'))
const Wizard = lazy(() => import('./pages/Wizard'))
const Generator = lazy(() => import('./pages/Generator'))
const Optimizer = lazy(() => import('./pages/Optimizer'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/docs/:slug" element={<Docs />} />
      <Route path="/prompts" element={<Prompts />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/wizard" element={<Wizard />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/optimize" element={<Optimizer />} />
    </Routes>
  )
}
