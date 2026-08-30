import { createContext, useContext, type ReactNode } from 'react'
import type { Database } from '../domain/types'
import { seed } from '../domain/seed'

/**
 * Acesso à base para toda a aplicação.
 *
 * Sem backend ainda, o estado é o seed em memória. O contexto existe desde já
 * para que nenhuma página importe `seed` diretamente: quando entrar um backend,
 * troca-se o provider e nenhuma tela muda.
 */
const DbContext = createContext<Database>(seed)

export function DbProvider({ children, db = seed }: { children: ReactNode; db?: Database }) {
  return <DbContext.Provider value={db}>{children}</DbContext.Provider>
}

export const useDb = (): Database => useContext(DbContext)
