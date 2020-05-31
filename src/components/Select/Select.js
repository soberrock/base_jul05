import React, { useState, useCallback } from 'react'
import makeId from 'Utils/makeId'
import { MenuItem, Button } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select';

function renderItem(item, { handleClick, modifiers }) {
  return (
    <MenuItem
      key={makeId()}
      className={item.seen ? 'seen' : ''}
      icon="folder-close"
      text={item.name}
      onClick={handleClick}
      active={modifiers.active}
    />
  )
}

export default function PSelect({ onChange, className, options }) {
  const [selection, setSelection] = useState()
  const changeHandler = useCallback((value) => {
    setSelection(value)
    onChange(value)
  })

  return (
    <Select
      className={className}
      items={options}
      itemRenderer={renderItem}
      onItemSelect={changeHandler}
      popoverProps={{ minimal: true }}
      filterable={false}
    >
      <Button
        icon="media"
        rightIcon="caret-down"
        text={selection ? selection.name : 'Choose One'}
      />
    </Select>
  )
}
