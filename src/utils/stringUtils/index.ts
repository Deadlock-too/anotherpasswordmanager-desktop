function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getFileNameFromPath(path: string) {
  return path.split('\\').pop()?.split('/').pop() ?? ''
}

export { capitalizeFirstLetter, getFileNameFromPath }