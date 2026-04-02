import { handleQuery, parseOrderBy } from './utils'

async function getModel() {
  const mod = await import('../../models/User')
  return mod.User || mod.default
}

export const users = {
  findUnique: async (query: { where: { clerkId: string } }) => {
    const Model = await getModel()
    return Model.findOne(query.where)
  },
  findFirst: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    return Model.findOne(q.where)
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
  update: async (query: { where: { clerkId: string }; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  upsert: async (query: { where: { clerkId: string }; create: any; update: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.update, { new: true, upsert: true })
  },
}
