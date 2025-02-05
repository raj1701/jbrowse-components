import React from 'react'
import { Checkbox, IconButton, FormControlLabel } from '@mui/material'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { indigo } from '@mui/material/colors'
import { makeStyles } from 'tss-react/mui'

// icons
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'

// locals
import SpreadsheetStateModel from '../models/Spreadsheet'
import RowStateModel from '../models/Row'
import CellData from './CellData'

type SpreadsheetModel = Instance<typeof SpreadsheetStateModel>
type RowModel = Instance<typeof RowStateModel>

const useStyles = makeStyles()(theme => {
  const { palette } = theme
  return {
    rowNumCell: {
      textAlign: 'left',
      border: `1px solid ${palette.action.disabledBackground}`,
      position: 'relative',
      padding: '0 2px 0 0',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    },
    rowNumber: {
      fontWeight: 'normal',
      display: 'inline-block',
      flex: 'none',
      paddingRight: '20px',
      margin: 0,
      whiteSpace: 'nowrap',
    },
    rowMenuButton: {
      padding: 0,
      margin: 0,
      position: 'absolute',
      right: 0,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      flex: 'none',
    },
    rowMenuButtonIcon: {},
    rowSelector: {
      position: 'relative',
      top: '-2px',
      margin: 0,
      padding: '0 0.2rem',
    },

    dataRowSelected: {
      background: indigo[100],
      '& th': {
        background: indigo[100],
      },
    },
    emptyMessage: { captionSide: 'bottom' },
  }
})

const DataRow = observer(function ({
  rowModel,
  rowNumber,
  spreadsheetModel,
}: {
  rowModel: RowModel
  rowNumber: string
  spreadsheetModel: SpreadsheetModel
}) {
  const { classes } = useStyles()
  const { hideRowSelection, columnDisplayOrder } = spreadsheetModel
  let rowClass = ''
  if (rowModel.isSelected) {
    rowClass += `${classes.dataRowSelected}`
  }

  function labelClick(evt: React.MouseEvent) {
    rowModel.toggleSelect()
    evt.stopPropagation()
    evt.preventDefault()
  }

  return (
    <tr className={rowClass}>
      <th className={classes.rowNumCell} onClick={labelClick}>
        {hideRowSelection ? (
          <FormControlLabel
            className={classes.rowNumber}
            control={
              <Checkbox
                className={classes.rowSelector}
                checked={rowModel.isSelected}
                onClick={labelClick}
              />
            }
            label={rowModel.id}
          />
        ) : null}
        <IconButton
          className={classes.rowMenuButton}
          onClick={event => {
            spreadsheetModel.setRowMenuPosition({
              anchorEl: event.currentTarget,
              rowNumber,
            })
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <ArrowDropDown className={classes.rowMenuButtonIcon} />
        </IconButton>
      </th>
      {columnDisplayOrder.map(colNumber => (
        <td key={colNumber}>
          <CellData
            cell={rowModel.cellsWithDerived[colNumber]}
            spreadsheetModel={spreadsheetModel}
            columnNumber={colNumber}
          />
        </td>
      ))}
    </tr>
  )
})

export default DataRow
