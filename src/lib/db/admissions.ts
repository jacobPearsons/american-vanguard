import { handleQuery, parseOrderBy } from './utils'

async function getModel() {
  const mod = await import('../../models/AdmissionApplication')
  return mod.AdmissionApplication || mod.default
}

export const admissions = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let builder = Model.findOne(q.where || {})
    if (q.select) builder = builder.select(q.select)
    if (q.orderBy) builder = builder.sort(parseOrderBy(q.orderBy))
    const results = await builder.limit(1)
    return results[0] || null
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let builder = Model.find(q.where || {})
    if (q.orderBy) builder = builder.sort(parseOrderBy(q.orderBy))
    return builder
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  findUnique: async (query: { where: { id: number } }) => {
    const Model = await getModel()
    return Model.findOne(query.where)
  },
}
