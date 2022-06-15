export interface CloneOrImportable {
  id: string
  creatorId: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export function stripForCloneOrImport<T extends CloneOrImportable>(model: T) {
  const { id, creatorId, userId, createdAt, updatedAt, ...modelData } = model

  return modelData
}
