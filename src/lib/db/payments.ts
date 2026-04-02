import { handleQuery } from './utils'

async function getModel() {
  const mod = await import('../../models/Payment')
  return mod.Payment || mod.default
}

export const payments = {
  findMany: async (query: any) => {
    const Model = await getModel()
    const q = handleQuery(query)
    return Model.find(q.where || {})
  },
  create: async (data: any) => {
    const Model = await getModel()
    return Model.create(data)
  },
  update: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.findOneAndUpdate(query.where, query.data, { new: true })
  },
  updateMany: async (query: { where: any; data: any }) => {
    const Model = await getModel()
    return Model.updateMany(query.where, query.data)
  },
}
