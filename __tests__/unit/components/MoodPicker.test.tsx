import { render, screen, fireEvent } from '@testing-library/react'
import { MoodPicker } from '@/components/mood/MoodPicker'

describe('MoodPicker', () => {
  it('renderiza los 5 emojis de ánimo', () => {
    const onSave = jest.fn()
    render(<MoodPicker onSave={onSave} />)

    expect(screen.getByText('Muy mal')).toBeInTheDocument()
    expect(screen.getByText('Mal')).toBeInTheDocument()
    expect(screen.getByText('Regular')).toBeInTheDocument()
    expect(screen.getByText('Bien')).toBeInTheDocument()
    expect(screen.getByText('Muy bien')).toBeInTheDocument()
  })

  it('no muestra el botón guardar hasta seleccionar un score', () => {
    const onSave = jest.fn()
    render(<MoodPicker onSave={onSave} />)

    expect(screen.queryByText('Guardar registro')).not.toBeInTheDocument()
  })

  it('muestra el botón guardar al seleccionar un score', () => {
    const onSave = jest.fn()
    render(<MoodPicker onSave={onSave} />)

    fireEvent.click(screen.getByText('Bien'))

    expect(screen.getByText('Guardar registro')).toBeInTheDocument()
  })

  it('llama onSave con el score correcto al guardar', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined)
    render(<MoodPicker onSave={onSave} />)

    fireEvent.click(screen.getByText('Bien'))
    fireEvent.click(screen.getByText('Guardar registro'))

    expect(onSave).toHaveBeenCalledWith(4, undefined)
  })

  it('muestra "Editar registro" cuando isEdit es true', () => {
    const onSave = jest.fn()
    render(<MoodPicker defaultScore={3} isEdit onSave={onSave} />)

    expect(screen.getByText('✏️ Editar registro')).toBeInTheDocument()
  })

  it('deshabilita el botón cuando loading es true', () => {
    const onSave = jest.fn()
    render(<MoodPicker defaultScore={3} loading onSave={onSave} />)

    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled()
  })
})
