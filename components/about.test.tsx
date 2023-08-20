import React from 'react'
import { JsonParameterTypeImpl } from '../lib/json_parameter';
import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import { About } from './about';

describe('About', () => {
  describe('when hasSetting is false', () => {
    it('renders correctly', () => {
      const jsonObject = {
        hasSetting: () => false,
      } as JsonParameterTypeImpl;
      render(<About jsonObject={jsonObject} />)

      expect(screen.queryByText('現在の設定情報')).not.toBeInTheDocument()
    })
  })

  describe('when hasSetting is true', () => {
    describe('when standardTime is true', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: 84,
          name: 'name',
          week: {},
          months: undefined,
        } as JsonParameterTypeImpl;
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when standardTime is null', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: undefined,
          name: 'name',
          week: {},
          months: undefined,
        } as JsonParameterTypeImpl;
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when months is present', () => {
      it('renders correctly', () => {
        const jsonObject = {
          hasSetting: () => true,
          standardTime: 84,
          name: 'name',
          week: {},
          months: {},
        } as JsonParameterTypeImpl;
        render(<About jsonObject={jsonObject} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })
  })
})
