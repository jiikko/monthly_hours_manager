import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { About } from './about';
import { Calendar } from '../lib/calendar';

describe('About', () => {
  describe('when hasSetting is false', () => {
    it('renders correctly', () => {
      const jsonObject = {
        hasSetting: () => false,
      } as any;
      render(<About calendar={jsonObject} />)

      expect(screen.queryByText('現在の設定情報')).not.toBeInTheDocument()
    })
  })

  describe('when hasSetting is true', () => {
    describe('when standardTime is true', () => {
      it('renders correctly', () => {
        const calendar = new Calendar('a', 84, { web: true } as any, undefined);
        render(<About calendar={calendar} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when standardTime is undefined', () => {
      it('renders correctly', () => {
        const calendar = new Calendar('a', undefined, { web: true } as any, undefined);
        render(<About calendar={calendar} />)
        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })

    describe('when months is present', () => {
      it('renders correctly', () => {
        const calendar = new Calendar('a', 84, { web: true } as any, {});
        render(<About calendar={calendar} />)

        expect(screen.queryByText('現在の設定情報')).toBeInTheDocument()
      })
    })
  })
})
