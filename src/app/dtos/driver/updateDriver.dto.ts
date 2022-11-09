import { Routes } from "../routes/routes.dto"

export type UpdateDriver = {
    id?: string
    name?: string
    cpf?: string
    cnh?: string
    validation?:  string
    category?: string
    routes?: Routes
    createdAt?: string
  }