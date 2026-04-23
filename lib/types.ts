export type Role = 'CLIENTE' | 'PROFISSIONAL'
export type JobType = 'NORMAL' | 'URGENT'
export type JobStatus = 'OPEN' | 'IN_NEGOTIATION' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface State {
  id: number
  name: string
  uf: string
}

export interface City {
  id: number
  name: string
}

export interface Skill {
  id: number
  name: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: Role
}

export interface Job {
  id: number
  clientId: number
  title: string
  description: string
  type: JobType
  status: JobStatus
  city: City
  createdAt: string
}

export interface Proposal {
  id: number
  jobId: number
  professionalId: number
  professionalName: string
  price: number
  estimatedTime: string
  status: ProposalStatus
  createdAt: string
}

export interface Profissional {
  id: number
  name: string
  email: string
  cep: string
  rating: number
  jobsCompleted: number
  isAvailableNow: boolean
  citiesServed: City[]
  skills: Skill[]
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: Role
}

export interface CreateJobRequest {
  title: string
  description: string
  type: JobType
  cityId: number
}

export interface CreateProposalRequest {
  jobId: number
  price: number
  estimatedTime: string
}

export interface CreateReviewRequest {
  jobId: number
  rating: number
  comment: string
}

export interface ProfileRequest {
  cep: string
  cityIds: number[]
  skillIds: number[]
}
