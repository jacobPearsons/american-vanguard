import { handleQuery, parseOrderBy, applyInclude } from './utils'

async function getModel() {
  const mod = await import('../../models/Grade')
  return mod.Grade || mod.default
}

export const grades = {
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.findOne(q.where)
    result = await applyInclude(result, q.include)
    return result
  },
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    let result = Model.find(q.where || {})
    if (q.orderBy) result = result.sort(parseOrderBy(q.orderBy))
    result = await applyInclude(result, q.include)
    return result
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  delete: async (query: { where: any }) => {
    const Model = await getModel()
    return Model.deleteOne(query.where)
  },
}
