import { Routes, Route, Navigate } from 'react-router'
import { lazy } from 'react'
import Home from './pages/Home'

const Docs = lazy(() => import('./pages/Docs'))
const CommunityPrompts = lazy(() => import('./pages/CommunityPrompts'))
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
      <Route path="/prompts" element={<Navigate to="/community-prompts" replace />} />
      <Route path="/community-prompts" element={<CommunityPrompts />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/wizard" element={<Wizard />} />
      <Route path="/generator" element={<Generator />} />
      <Route path="/optimize" element={<Optimizer />} />
    </Routes>
  )
}
