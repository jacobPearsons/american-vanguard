export function convertPrismaOperators(where: any): any {
  if (!where || typeof where !== 'object') return where

  const converted: any = {}
  for (const key of Object.keys(where)) {
    const value = where[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (value.in !== undefined) converted[key] = { $in: value.in }
      else if (value.notIn !== undefined) converted[key] = { $nin: value.notIn }
      else if (value.gte !== undefined) converted[key] = { $gte: value.gte }
      else if (value.lte !== undefined) converted[key] = { $lte: value.lte }
      else if (value.gt !== undefined) converted[key] = { $gt: value.gt }
      else if (value.lt !== undefined) converted[key] = { $lt: value.lt }
      else if (value.contains !== undefined) converted[key] = { $regex: value.contains, $options: 'i' }
      else if (value.startsWith !== undefined) converted[key] = { $regex: `^${value.startsWith}`, $options: 'i' }
      else if (value.endsWith !== undefined) converted[key] = { $regex: `${value.endsWith}$`, $options: 'i' }
      else if (value.equals !== undefined) converted[key] = value.equals
      else if (value.not !== undefined) converted[key] = { $ne: value.not }
      else converted[key] = convertPrismaOperators(value)
    } else {
      converted[key] = value
    }
  }
  return converted
}

export function handleQuery(query: any) {
  const result: any = {}
  if (query.where) result.where = convertPrismaOperators(query.where)
  if (query.select) result.select = query.select
  if (query.orderBy) result.orderBy = query.orderBy
  if (query.include) result.include = query.include
  return result
}

export function transformResult(doc: any): any {
  if (!doc) return doc
  if (doc._id) doc.id = doc._id.toString()
  return doc
}

export function transformResults(docs: any[]): any[] {
  return docs.map(transformResult)
}

export async function applyInclude(modelQuery: any, include: any) {
  if (!include) return modelQuery
  
  const populate: string[] = []
  for (const key of Object.keys(include)) {
    if (include[key] === true) {
      populate.push(key)
    } else if (typeof include[key] === 'object') {
      populate.push({ path: key, ...include[key] })
    }
  }
  
  if (populate.length > 0) {
    return modelQuery.populate(populate)
  }
  return modelQuery
}

export function parseOrderBy(orderBy: any) {
  if (!orderBy) return undefined
  const sortField = Object.keys(orderBy)[0]
  const sortOrder = Object.values(orderBy)[0] === 'desc' ? -1 : 1
  return { [sortField]: sortOrder }
}
