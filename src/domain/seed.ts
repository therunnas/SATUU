import type {
  Account,
  Budget,
  Client,
  Database,
  Expense,
  Fringe,
  LineItem,
  Organization,
  Project,
  UnitKind,
  User,
} from './types'

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

const orcamentoTravessia: Budget = {
  id: 'orc-001',
  projectId: 'prj-001',
  project: 'A Travessia',
  version: 'v3',
  status: 'aprovado',
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

/* ------------------------------------------------------------ produtora */

const ENCARGOS_PADRAO: Fringe[] = [
  { id: ENCARGOS, name: 'Encargos sociais', rate: 0.2 },
  { id: SINDICATO, name: 'Sindicato', rate: 0.05 },
]

const organization: Organization = {
  id: 'org-001',
  name: 'Aurora Filmes',
  legalName: 'Aurora Produções Audiovisuais Ltda.',
  taxId: '12.345.678/0001-90',
  city: 'São Paulo',
  state: 'SP',
  defaultFringes: ENCARGOS_PADRAO,
}

const users: User[] = [
  { id: 'usr-001', name: 'Vinícius Marques', email: 'vinicius@aurorafilmes.com.br', role: 'admin', initials: 'VM' },
  { id: 'usr-002', name: 'Helena Prado', email: 'helena@aurorafilmes.com.br', role: 'produtor', initials: 'HP' },
  { id: 'usr-003', name: 'Rafael Duarte', email: 'rafael@aurorafilmes.com.br', role: 'financeiro', initials: 'RD' },
  { id: 'usr-004', name: 'Camila Souza', email: 'camila@aurorafilmes.com.br', role: 'leitura', initials: 'CS' },
]

/* ------------------------------------------------------------ clientes */

const clients: Client[] = [
  { id: 'cli-001', name: 'Vertente Distribuidora', kind: 'produtora', contactName: 'Marina Alves', contactEmail: 'marina@vertente.com.br', city: 'São Paulo' },
  { id: 'cli-002', name: 'Nexo Streaming', kind: 'streaming', contactName: 'Paulo Ferraz', contactEmail: 'paulo@nexo.tv', city: 'Rio de Janeiro' },
  { id: 'cli-003', name: 'Campo Publicidade', kind: 'agencia', contactName: 'Bia Nogueira', contactEmail: 'bia@campo.ag', city: 'São Paulo' },
  { id: 'cli-004', name: 'Vitrola Bebidas', kind: 'marca', contactName: 'Diego Matos', contactEmail: 'diego@vitrola.com.br', city: 'Belo Horizonte' },
]

/* ------------------------------------------------------------ projetos */

const projects: Project[] = [
  { id: 'prj-001', name: 'A Travessia', clientId: 'cli-001', format: 'longa', status: 'producao', startDate: '2026-06-01', endDate: '2026-12-18', shootDays: 30 },
  { id: 'prj-002', name: 'Correnteza · Série documental', clientId: 'cli-002', format: 'serie', status: 'pos_producao', startDate: '2026-03-10', endDate: '2026-09-30', shootDays: 22 },
  { id: 'prj-003', name: 'Vitrola · Campanha Verão', clientId: 'cli-004', format: 'publicidade', status: 'pre_producao', startDate: '2026-09-15', endDate: '2026-11-05', shootDays: 4 },
  { id: 'prj-004', name: 'Campo · Institucional', clientId: 'cli-003', format: 'publicidade', status: 'entregue', startDate: '2026-01-08', endDate: '2026-04-22', shootDays: 3 },
]

/* --------------------------------------------------- orçamentos menores */

const conta = (id: string, code: string, name: string, lines: LineItem[]): Account => ({ id, code, name, lines })

const orcamentoCorrenteza: Budget = {
  id: 'orc-002',
  projectId: 'prj-002',
  project: 'Correnteza · Série documental',
  version: 'v2',
  status: 'aprovado',
  currency: 'BRL',
  fringes: ENCARGOS_PADRAO,
  sections: [
    {
      kind: 'atl',
      name: 'Acima da linha',
      accounts: [
        conta('c2-1100', '1100', 'Direção', [
          line('l2-1101', 'Direção', 1, 16, 'semana', 7500, [ENCARGOS, SINDICATO]),
          line('l2-1102', 'Pesquisa e roteiro', 2, 10, 'semana', 3800, [ENCARGOS]),
        ]),
        conta('c2-1300', '1300', 'Produção executiva', [
          line('l2-1301', 'Produção executiva', 1, 20, 'semana', 7000, [ENCARGOS]),
        ]),
      ],
    },
    {
      kind: 'btl',
      name: 'Abaixo da linha',
      accounts: [
        conta('c2-2100', '2100', 'Equipe técnica', [
          line('l2-2101', 'Direção de fotografia', 1, 22, 'diaria', 2200, [ENCARGOS, SINDICATO]),
          line('l2-2102', 'Som direto', 1, 22, 'diaria', 1250, [ENCARGOS]),
        ]),
        conta('c2-2200', '2200', 'Equipamento', [
          line('l2-2201', 'Pacote de câmera', 1, 5, 'semana', 18000),
        ]),
        conta('c2-2400', '2400', 'Locação e diárias', [
          line('l2-2401', 'Viagens e diárias', 1, 1, 'verba', 168000),
          line('l2-2402', 'Alimentação', 18, 22, 'diaria', 58),
        ]),
        conta('c2-3100', '3100', 'Pós-produção', [
          line('l2-3101', 'Montagem', 1, 20, 'semana', 6800, [ENCARGOS]),
          line('l2-3102', 'Finalização', 1, 1, 'verba', 74000),
        ]),
      ],
    },
  ],
}

const orcamentoVitrola: Budget = {
  id: 'orc-003',
  projectId: 'prj-003',
  project: 'Vitrola · Campanha Verão',
  version: 'v1',
  status: 'rascunho',
  currency: 'BRL',
  fringes: ENCARGOS_PADRAO,
  sections: [
    {
      kind: 'atl',
      name: 'Acima da linha',
      accounts: [
        conta('c3-1100', '1100', 'Direção', [
          line('l3-1101', 'Direção', 1, 3, 'semana', 12000, [ENCARGOS, SINDICATO]),
        ]),
        conta('c3-1400', '1400', 'Elenco', [
          line('l3-1401', 'Elenco principal', 2, 1, 'cache', 38000, [ENCARGOS, SINDICATO]),
          line('l3-1402', 'Figuração', 12, 2, 'diaria', 480, [ENCARGOS]),
        ]),
      ],
    },
    {
      kind: 'btl',
      name: 'Abaixo da linha',
      accounts: [
        conta('c3-2100', '2100', 'Equipe técnica', [
          line('l3-2101', 'Equipe de câmera', 4, 4, 'diaria', 1400, [ENCARGOS, SINDICATO]),
          line('l3-2102', 'Elétrica e maquinaria', 5, 4, 'diaria', 820, [ENCARGOS]),
        ]),
        conta('c3-2200', '2200', 'Equipamento', [
          line('l3-2201', 'Pacote completo', 1, 2, 'semana', 32000),
        ]),
        conta('c3-2300', '2300', 'Arte e figurino', [
          line('l3-2301', 'Cenografia', 1, 1, 'verba', 68000),
          line('l3-2302', 'Figurino', 1, 1, 'verba', 24000),
        ]),
        conta('c3-3100', '3100', 'Pós-produção', [
          line('l3-3101', 'Finalização e trilha', 1, 1, 'verba', 92000),
        ]),
      ],
    },
  ],
}

const orcamentoCampo: Budget = {
  id: 'orc-004',
  projectId: 'prj-004',
  project: 'Campo · Institucional',
  version: 'v2',
  status: 'aprovado',
  currency: 'BRL',
  fringes: ENCARGOS_PADRAO,
  sections: [
    {
      kind: 'atl',
      name: 'Acima da linha',
      accounts: [
        conta('c4-1100', '1100', 'Direção', [
          line('l4-1101', 'Direção', 1, 2, 'semana', 9500, [ENCARGOS]),
        ]),
      ],
    },
    {
      kind: 'btl',
      name: 'Abaixo da linha',
      accounts: [
        conta('c4-2100', '2100', 'Equipe técnica', [
          line('l4-2101', 'Equipe reduzida', 5, 3, 'diaria', 1100, [ENCARGOS]),
        ]),
        conta('c4-2200', '2200', 'Equipamento', [
          line('l4-2201', 'Pacote leve', 1, 1, 'semana', 14500),
        ]),
        conta('c4-3100', '3100', 'Pós-produção', [
          line('l4-3101', 'Montagem e finalização', 1, 1, 'verba', 46000),
        ]),
      ],
    },
  ],
}

/* ------------------------------------------------------------ despesas */

const gasto = (
  id: string,
  projectId: string,
  accountCode: string,
  description: string,
  supplier: string,
  date: string,
  reais: number,
  status: Expense['status'],
  userId = 'usr-003',
): Expense => ({
  id,
  projectId,
  accountCode,
  description,
  supplier,
  date,
  amountCents: Math.round(reais * 100),
  status,
  userId,
})

const expenses: Expense[] = [
  // A Travessia — em produção, é onde há mais movimento
  gasto('exp-001', 'prj-001', '2200', 'Locação de câmera · bloco 1', 'Cine Equipamentos', '2026-06-08', 84000, 'paga'),
  gasto('exp-002', 'prj-001', '2200', 'Locação de luz · bloco 1', 'LuzViva', '2026-06-08', 58500, 'paga'),
  gasto('exp-003', 'prj-001', '2400', 'Locação · casarão Santa Cruz', 'Espaço Santa Cruz', '2026-06-15', 72000, 'paga'),
  gasto('exp-004', 'prj-001', '2400', 'Alimentação · semanas 1 a 3', 'Bom Prato Catering', '2026-06-28', 118600, 'paga'),
  gasto('exp-005', 'prj-001', '2100', 'Equipe técnica · junho', 'Folha de pagamento', '2026-06-30', 196000, 'paga', 'usr-002'),
  gasto('exp-006', 'prj-001', '2300', 'Construção de cenário', 'Oficina Marcenaria', '2026-07-05', 152000, 'paga'),
  gasto('exp-007', 'prj-001', '2300', 'Figurino · confecção', 'Ateliê Linha', '2026-07-12', 61000, 'aprovada'),
  gasto('exp-008', 'prj-001', '2400', 'Transporte · julho', 'Frota Rio Sul', '2026-07-20', 48000, 'aprovada'),
  gasto('exp-009', 'prj-001', '1400', 'Cachê · elenco de apoio', 'Diversos', '2026-07-22', 63000, 'pendente', 'usr-002'),
  gasto('exp-010', 'prj-001', '2100', 'Diárias extras · som', 'Freelancers', '2026-07-25', 15600, 'pendente', 'usr-002'),
  gasto('exp-011', 'prj-001', '4100', 'Marketing de bastidores', 'Studio Boa Onda', '2026-07-26', 22000, 'pendente', 'usr-002'),
  gasto('exp-012', 'prj-001', '2200', 'Lente adicional · não prevista', 'Cine Equipamentos', '2026-07-28', 19500, 'recusada'),

  // Correnteza — em pós
  gasto('exp-020', 'prj-002', '2400', 'Viagens · expedição norte', 'Agência Rota', '2026-04-02', 96000, 'paga'),
  gasto('exp-021', 'prj-002', '2100', 'Equipe técnica · campo', 'Folha de pagamento', '2026-04-30', 88000, 'paga'),
  gasto('exp-022', 'prj-002', '3100', 'Montagem · parcela 1', 'Ilha Corte', '2026-07-15', 68000, 'paga'),
  gasto('exp-023', 'prj-002', '3100', 'Finalização de imagem', 'Cor & Cia', '2026-08-20', 74000, 'aprovada'),
  gasto('exp-024', 'prj-002', '2200', 'Locação de câmera', 'Cine Equipamentos', '2026-03-20', 82000, 'paga'),

  // Vitrola — pré-produção, quase nada lançado
  gasto('exp-030', 'prj-003', '2300', 'Adiantamento de cenografia', 'Oficina Marcenaria', '2026-08-25', 24000, 'aprovada'),
  gasto('exp-031', 'prj-003', '2200', 'Reserva de equipamento', 'Cine Equipamentos', '2026-08-28', 12000, 'pendente', 'usr-002'),

  // Campo — entregue e fechado
  gasto('exp-040', 'prj-004', '2100', 'Equipe · diárias', 'Folha de pagamento', '2026-02-14', 17200, 'paga'),
  gasto('exp-041', 'prj-004', '2200', 'Equipamento', 'Cine Equipamentos', '2026-02-14', 14200, 'paga'),
  gasto('exp-042', 'prj-004', '3100', 'Montagem e finalização', 'Ilha Corte', '2026-03-30', 45000, 'paga'),
]

/* ------------------------------------------------------------ base */

export const seed: Database = {
  organization,
  currentUser: users[0],
  users,
  clients,
  projects,
  budgets: [orcamentoTravessia, orcamentoCorrenteza, orcamentoVitrola, orcamentoCampo],
  expenses,
}

/** Mantido para os testes do núcleo de cálculo, que orçam uma peça só. */
export const budgetSeed = orcamentoTravessia
