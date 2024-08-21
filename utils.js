export function mockedTasks(
  id,
  title,
  status,
  date,
  description,
  userId,
  listId,
  tags
) {
  return {
    id: id,
    title: title,
    status: status,
    date: date,
    description: description,
    userId: userId,
    listId: listId,
    tags: tags,
  }
}

export function mockedList(id, name, userid) {
  return { id: id, name: name, userid: userid }
}
