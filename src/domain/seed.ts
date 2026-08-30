import type { Budget, LineItem, UnitKind } from './types'

/**
 * Orçamento de exemplo: um longa nacional de porte médio, 30 diárias.
 *
 * Os valores são plausíveis para o mercado brasileiro, mas o que importa aqui é
 * a estrutura — nenhum total está fixo, todos saem de `calc.ts`.
 */

const line = (
  id: string,
  description: string,
  quantity: number,
  units: number,
  unitKind: UnitKind,
  unitReais: number,
  fringeIds: string[] = [],
): LineItem => ({
  id,
  description,
  quantity,
  units,
  unitKind,
  unitCents: Math.round(unitReais * 100),
  fringeIds,
})

const ENCARGOS = 'encargos'
const SINDICATO = 'sindicato'

export const budgetSeed: Budget = {
  id: 'orc-001',
  project: 'A Travessia · Longa-metragem',
  version: 'v3 · Orçamento aprovado',
  currency: 'BRL',
  fringes: [
    { id: ENCARGOS, name: 'Encargos sociais', rate: 0.2 },
    { id: SINDICATO, name: 'Sindicato', rate: 0.05 },
  ],
  sections: [
    {
      kind: 'atl',
      name: 'Acima da linha',
      accounts: [
        {
          id: 'acc-1100',
          code: '1100',
          name: 'Direção',
          lines: [
            line('l-1101', 'Direção', 1, 20, 'semana', 9000, [ENCARGOS, SINDICATO]),
            line('l-1102', 'Assistência de direção', 1, 14, 'semana', 4200, [ENCARGOS, SINDICATO]),
            line('l-1103', 'Continuísta', 1, 30, 'diaria', 850, [ENCARGOS]),
          ],
        },
        {
          id: 'acc-1200',
          code: '1200',
          name: 'Roteiro',
          lines: [
            line('l-1201', 'Roteiro original', 1, 1, 'cache', 120000, [SINDICATO]),
            line('l-1202', 'Consultoria de roteiro', 2, 1, 'cache', 15000),
          ],
        },
        {
          id: 'acc-1300',
          code: '1300',
          name: 'Produção executiva',
          lines: [
            line('l-1301', 'Produção executiva', 1, 24, 'semana', 8500, [ENCARGOS]),
            line('l-1302', 'Direção de produção', 1, 18, 'semana', 6800, [ENCARGOS]),
          ],
        },
        {
          id: 'acc-1400',
          code: '1400',
          name: 'Elenco principal',
          lines: [
            line('l-1401', 'Protagonista', 1, 1, 'cache', 180000, [ENCARGOS, SINDICATO]),
            line('l-1402', 'Coadjuvante', 3, 1, 'cache', 60000, [ENCARGOS, SINDICATO]),
            line('l-1403', 'Elenco de apoio', 8, 6, 'diaria', 1200, [ENCARGOS, SINDICATO]),
          ],
        },
      ],
    },
    {
      kind: 'btl',
      name: 'Abaixo da linha',
      accounts: [
        {
          id: 'acc-2100',
          code: '2100',
          name: 'Equipe técnica',
          lines: [
            line('l-2101', 'Direção de fotografia', 1, 30, 'diaria', 2400, [ENCARGOS, SINDICATO]),
            line('l-2102', 'Operação de câmera', 2, 30, 'diaria', 1100, [ENCARGOS, SINDICATO]),
            line('l-2103', 'Elétrica e maquinaria', 6, 30, 'diaria', 750, [ENCARGOS]),
            line('l-2104', 'Som direto', 2, 30, 'diaria', 1300, [ENCARGOS, SINDICATO]),
          ],
        },
        {
          id: 'acc-2200',
          code: '2200',
          name: 'Equipamento',
          lines: [
            line('l-2201', 'Pacote de câmera', 1, 6, 'semana', 28000),
            line('l-2202', 'Pacote de luz e maquinaria', 1, 6, 'semana', 19500),
            line('l-2203', 'Pacote de som', 1, 6, 'semana', 6200),
          ],
        },
        {
          id: 'acc-2300',
          code: '2300',
          name: 'Arte e figurino',
          lines: [
            line('l-2301', 'Direção de arte', 1, 16, 'semana', 6500, [ENCARGOS]),
            line('l-2302', 'Cenografia e construção', 1, 1, 'verba', 145000),
            line('l-2303', 'Figurino', 1, 1, 'verba', 78000),
            line('l-2304', 'Caracterização', 2, 30, 'diaria', 900, [ENCARGOS]),
          ],
        },
        {
          id: 'acc-2400',
          code: '2400',
          name: 'Locação e diárias',
          lines: [
            line('l-2401', 'Locações', 1, 1, 'verba', 190000),
            line('l-2402', 'Transporte de equipe', 1, 30, 'diaria', 4200),
            line('l-2403', 'Alimentação', 65, 30, 'diaria', 62),
            line('l-2404', 'Hospedagem', 22, 24, 'diaria', 210),
          ],
        },
        {
          id: 'acc-3100',
          code: '3100',
          name: 'Pós-produção',
          lines: [
            line('l-3101', 'Montagem', 1, 16, 'semana', 7200, [ENCARGOS]),
            line('l-3102', 'Finalização de imagem', 1, 1, 'verba', 96000),
            line('l-3103', 'Mixagem e desenho de som', 1, 1, 'verba', 84000),
            line('l-3104', 'Trilha original', 1, 1, 'cache', 65000, [SINDICATO]),
          ],
        },
        {
          id: 'acc-3200',
          code: '3200',
          name: 'Seguros e taxas',
          lines: [
            line('l-3201', 'Seguro de produção', 1, 1, 'verba', 52000),
            line('l-3202', 'Taxas e licenças', 1, 1, 'verba', 23500),
          ],
        },
      ],
    },
  ],
}
