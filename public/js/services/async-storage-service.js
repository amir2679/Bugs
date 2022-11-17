export const storageService = {
  query,
  get,
  post,
  put,
  remove,
}

function query(entityType, delay = 100) {
  const entities = JSON.parse(localStorage.getItem(entityType)) || _createDefaultBugs()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(entities)
    }, delay)
  })
}

function get(entityType, entityId) {
  return query(entityType).then((entities) => entities.find((entity) => entity._id === entityId))
}

function post(entityType, newEntity) {
  newEntity._id = _makeId()
  return query(entityType).then((entities) => {
    entities.push(newEntity)
    _save(entityType, entities)
    return newEntity
  })
}

function put(entityType, updatedEntity) {
  return query(entityType).then((entities) => {
    const idx = entities.findIndex((entity) => entity._id === updatedEntity._id)
    entities.splice(idx, 1, updatedEntity)
    _save(entityType, entities)
    return updatedEntity
  })
}

function remove(entityType, entityId) {
  return query(entityType).then((entities) => {
    const idx = entities.findIndex((entity) => entity._id === entityId)
    entities.splice(idx, 1)
    _save(entityType, entities)
  })
}

function _save(entityType, entities) {
  localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
  let str = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return str
}

function _createDefaultBugs() {
  return [
    {
      _id: "abc123",
      title: "Spider",
      description: "My spider",
      severity: 3,
      createdAt: 1542107359454
    },
    {
      _id: "abc124",
      title: "Bee",
      description: "My bee",
      severity: 3,
      createdAt: 1542107359454
    },
    {
      _id: "abc125",
      title: "Dragonfly",
      description: "My dragonfly",
      severity: 3,
      createdAt: 154210735945
    },
    {
      _id: "abc126",
      title: "Beetle",
      description: "My beetle",
      severity: 3,
      createdAt: 1542107359454
    }
  ]
}
