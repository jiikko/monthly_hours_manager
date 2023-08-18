import React from 'react'
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import { About } from './about';

describe('About', () => {
  describe('when hasSetting is false', () => {
    it('renders correctly', () => {
      const jsonObject = {
        hasSetting: () => false,
      }
      render(<About jsonObject={jsonObject} />)

      expect(screen.queryByText('現在の設定情報')).not.toBeInTheDocument()
    })
  })

  describe('when hasSetting is true', () => {
    describe('when standardTime is true', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: true,
          name: 'name',
          week: {},
          months: null,
        }
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when standardTime is null', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: null,
          name: 'name',
          week: {},
          months: null,
        }
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when months is present', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: true,
          name: 'name',
          week: {},
          months: {},
        }
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })
  })
})
