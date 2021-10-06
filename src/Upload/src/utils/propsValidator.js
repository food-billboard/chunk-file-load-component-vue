function valueValidator(value) {
  if(value === undefined) return true 
  const targetValue = Array.isArray(value) ? value : [value]
  return targetValue.every(item => {
    return typeof item === "string" || (item.id && item.name)
  })
}

export default {
  value: valueValidator,
  defaultValue: valueValidator,
  viewType(value) {
    return value === "list" || value === "card"
  }
}